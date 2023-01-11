#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AlbStack } from '../lib/alb/alb-stack';
import { EcrStack } from '../lib/ecr/ecr-stack';
import { FargateStack } from '../lib/fargate/fargate-stack';
import { VpcStack } from '../lib/vpc/vpc-stack';

const accountId = process.env.ACCOUNT_ID;
const region = process.env.REGION;
const prefix = process.env.ENVIRONMENT;

if (!accountId) {
    throw new Error('ACCOUNT_ID environment variable is not set');
}

if (!region) {
    throw new Error('REGION environment variable is not set');
}

if (!prefix) {
    throw new Error('ENVIRONMENT environment variable is not set');
}

const app = new cdk.App();

const vpcStack = new VpcStack(app, `todos-vpc-stack-${prefix}`, {
    env: { account: accountId, region: region },
    prefix: prefix,
});

const ecrStack = new EcrStack(app, `todos-ecr-stack-${prefix}`, {
    env: { account: accountId, region: region },
    prefix: prefix,
});

const fargateStack = new FargateStack(app, `todos-fargate-stack-${prefix}`, {
    env: { account: accountId, region: region },
    prefix: prefix,
    vpc: vpcStack.vpc,
    ecr: ecrStack.repository,
});

new AlbStack(app, `todos-alb-stack-${prefix}`, {
    env: { account: accountId, region: region },
    prefix: prefix,
    vpc: vpcStack.vpc,
    service: fargateStack.service,
});

app.synth();

