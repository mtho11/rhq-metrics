/*
 * RHQ Management Platform
 * Copyright (C) 2005-2014 Red Hat, Inc.
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
 */

package org.rhq.metrics.restServlet;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

/**
 * A filter to wrap json answers as jsonp
 * For this to happen, the user has to pass ?&lt;filter.jsonp.callback>=&lt;name> in the url like
 * <pre>http://localhost:7080/rest/metric/data/10001/raw.json?jsonp=foo</pre>
 * The &lt;filter.jsonp.callback> is defined in web.xml and defaults to 'jsonp'.
 * @author Heiko W. Rupp
 */
@WebFilter(urlPatterns = "/*", asyncSupported = true)
@WebInitParam(name = "filter.jsonp.callback", value = "jsonp", description = "Name of the callback to use for JsonP (?jsonp=...)")
public class JsonPFilter implements Filter {
    private static final String DEFAULT_CALLBACK_NAME = "jsonp";
    private String callbackName;

    public void destroy() {
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException,
        IOException {

        if (!(request instanceof HttpServletRequest)) {
            throw new ServletException("This filter can only process HttpServletRequest requests");
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        if (hasCallback(httpRequest)) {

            String callback = getCallback(httpRequest);

            JsonPResponseWrapper responseWrapper = new JsonPResponseWrapper(httpResponse);

            chain.doFilter(request, responseWrapper);

            if (request.isAsyncStarted()) {
                // We have an async "backend" servlet, so we need to create a listener and
                // have it "wait" for the data.
                AsyncListener asyncListener = request.getAsyncContext().createListener(JsonPAsyncListener.class);
                ((JsonPAsyncListener)asyncListener).set(httpResponse,
                    callback);
                request.getAsyncContext().addListener(asyncListener, request, responseWrapper);
            } else {

                // Normal case, no async processing started.
                OutputStream outputStream = response.getOutputStream();
                response.setContentType("application/javascript; charset=utf-8");
                outputStream.write((callback + "(").getBytes(StandardCharsets.UTF_8));
                responseWrapper.getByteArrayOutputStream().writeTo(outputStream);
                outputStream.write(");".getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            }

        } else {
            chain.doFilter(request, response);
        }
    }

    public void init(FilterConfig config) throws ServletException {
        callbackName = config.getInitParameter("filter.jsonp.callback");
        if (callbackName==null) {
            callbackName = DEFAULT_CALLBACK_NAME;
        }
    }

    private boolean hasCallback(ServletRequest request) {
        String cb = request.getParameter(callbackName);
        return (cb != null && !cb.isEmpty());
    }

    private String getCallback(HttpServletRequest request) {
        String parameter = request.getParameter(callbackName);
        if (parameter == null) {
            parameter = DEFAULT_CALLBACK_NAME;
        }
        return parameter;
    }

    static class JsonPResponseWrapper extends HttpServletResponseWrapper {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        private JsonPResponseWrapper(HttpServletResponse response) {
            super(response);
        }

        ByteArrayOutputStream getByteArrayOutputStream() {
            return baos;
        }

        @Override
        public ServletOutputStream getOutputStream() throws IOException {
            return new ServletOutputStream() {
                @Override
                public void write(int b) throws IOException {
                    baos.write(b);
                }
            };
        }

        @Override
        public PrintWriter getWriter() throws IOException {
            return new PrintWriter(baos);
        }
    }
}
