#!/bin/bash

# Usage start.sh [mem|cass] [bind_addr]

# set -x

BACKEND=mem
# uncomment the next line if you want to use an already running Cassandra server for the backend.
# BACKEND=cass

# By default bind user ports to all interfaces
BIND_ADDR=0.0.0.0

if [ x$1 == "xcass" -o x$1 == "xmem" ]
then
    BACKEND=$1
    shift
fi

if [ ! x$1 == "x" ]
then
    BIND_ADDR=$1
fi

WFLY_VERSION=`grep "<version.wildfly>" pom.xml | sed -E 's/^.*y>(8.*l)<.*$/\1/'`

mvn install -DskipTests

if [ ! -e target ]
then
    mkdir target
fi

MVN_REPO=`mvn help:evaluate -Dexpression=settings.localRepository | grep -v '[INFO]'`
WFLY_ZIP=${MVN_REPO}/org/wildfly/wildfly-dist/${WFLY_VERSION}/wildfly-dist-${WFLY_VERSION}.zip

if [ ! -e target/wild* ]
then
    cd target
    unzip ${WFLY_ZIP}
    cd ..
fi

cp rest-servlet/target/rhq-metric-rest*.war target/wildfly-${WFLY_VERSION}/standalone/deployments/
cp ui/console/target/metrics-console-*.war target/wildfly-${WFLY_VERSION}/standalone/deployments/
cp ui/explorer/target/explorer-*.war target/wildfly-${WFLY_VERSION}/standalone/deployments/
target/wildfly-${WFLY_VERSION}/bin/standalone.sh -Drhq-metrics.backend=${BACKEND} --debug 8787 -b ${BIND_ADDR}
