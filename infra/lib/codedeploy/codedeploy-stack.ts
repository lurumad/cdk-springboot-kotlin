import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface CodeDeployStackProps extends cdk.StackProps {
    suffix: string;
    service: ecs.FargateService;
    prodTargetGroup: elb.ApplicationTargetGroup;
    testTargetGroup: elb.ApplicationTargetGroup;
    prodListener: elb.ApplicationListener;
    testListener: elb.ApplicationListener;
    alarms: Array<cloudwatch.Alarm>;
}

export class CodeDeployStack extends cdk.Stack {
    public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: CodeDeployStackProps) {
        super(scope, id, props);

        const deploymentGroup = new codedeploy.EcsDeploymentGroup(this, `DeploymentGroup-${props.suffix}`, {
            alarms: props.alarms,
            autoRollback: {
                stoppedDeployment: true,
            },
            service: props.service,
            blueGreenDeploymentConfig: {
                blueTargetGroup: props.prodTargetGroup,
                greenTargetGroup: props.testTargetGroup,
                listener: props.prodListener,
                testListener: props.testListener,
                terminationWaitTime: cdk.Duration.minutes(5),
            },
            deploymentConfig: codedeploy.EcsDeploymentConfig.ALL_AT_ONCE,
        });
    }
}