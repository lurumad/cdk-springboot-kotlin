#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AlbStack } from '../lib/alb/alb-stack';
import { AutoScaleStack } from '../lib/autoscale/auto-scale-stack';
import { EcrStack } from '../lib/ecr/ecr-stack';
import { FargateStack } from '../lib/fargate/fargate-stack';
import { VpcStack } from '../lib/vpc/vpc-stack';

const accountId = process.env.ACCOUNT_ID;
const region = process.env.REGION;
const suffix = process.env.ENVIRONMENT;

if (!accountId) {
    throw new Error('ACCOUNT_ID environment variable is not set');
}

if (!region) {
    throw new Error('REGION environment variable is not set');
}

if (!suffix) {
    throw new Error('ENVIRONMENT environment variable is not set');
}

const app = new cdk.App();

const vpcStack = new VpcStack(app, `todos-vpc-stack-${suffix}`, {
    env: { account: accountId, region: region },
    suffix: suffix,
});

const ecrStack = new EcrStack(app, `todos-ecr-stack-${suffix}`, {
    env: { account: accountId, region: region },
    suffix: suffix,
});

const fargateStack = new FargateStack(app, `todos-fargate-stack-${suffix}`, {
    env: { account: accountId, region: region },
    suffix: suffix,
    vpc: vpcStack.vpc,
    ecr: ecrStack.repository,
    imageTag: process.env.IMAGE_TAG || null,
});

const albStack = new AlbStack(app, `todos-alb-stack-${suffix}`, {
    env: { account: accountId, region: region },
    suffix: suffix,
    vpc: vpcStack.vpc,
    service: fargateStack.service,
});

new AutoScaleStack(app, `todos-autoscale-stack-${suffix}`, {
    env: { account: accountId, region: region },
    suffix: suffix,
    cluster: fargateStack.cluster,
    service: fargateStack.service,
    loadBalancer: albStack.applicationLoadBalancer,
    targetGroup: albStack.targetGroup,
});

app.synth();

