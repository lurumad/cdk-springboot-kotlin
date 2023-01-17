import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface CloudWatchStackProps extends cdk.StackProps {
    suffix: string;
    prodTargetGroup: elb.ApplicationTargetGroup;
    testTargetGroup: elb.ApplicationTargetGroup;
}

export class CloudWatchStack extends cdk.Stack {
    public alarms: Array<cloudwatch.Alarm>;

    constructor(scope: Construct, id: string, props: CloudWatchStackProps) {
        super(scope, id, props);

        const blueUnhealthyHosts = new cloudwatch.Alarm(this, 'BlueUnhealthyHosts', {
            alarmName: `Unhealthy-Hosts-Blue-${props.suffix}`,
            metric: props.prodTargetGroup.metricUnhealthyHostCount(),
            threshold: 1,
            evaluationPeriods: 2,
        });
        const greenUnhealthyHosts = new cloudwatch.Alarm(this, 'GreenUnhealthyHosts', {
            alarmName: `Unhealthy-Hosts-Green-${props.suffix}`,
            metric: props.testTargetGroup.metricUnhealthyHostCount(),
            threshold: 1,
            evaluationPeriods: 2,
        });

        const blueApiFailure = new cloudwatch.Alarm(this, 'Blue5xx', {
            alarmName: `Http-5xx-Blue-${props.suffix}`,
            metric: props.prodTargetGroup.metricHttpCodeTarget(
                elb.HttpCodeTarget.TARGET_5XX_COUNT,
                { period: cdk.Duration.minutes(1) },
            ),
            threshold: 1,
            evaluationPeriods: 1,
        });
        const greenApiFailure = new cloudwatch.Alarm(this, 'Green5xx', {
            alarmName: `Http-5xx-Green-${props.suffix}`,
            metric: props.testTargetGroup.metricHttpCodeTarget(
                elb.HttpCodeTarget.TARGET_5XX_COUNT,
                { period: cdk.Duration.minutes(1) },
            ),
            threshold: 1,
            evaluationPeriods: 1,
        });

        this.alarms = [blueUnhealthyHosts, greenUnhealthyHosts, blueApiFailure, greenApiFailure];
    }
}