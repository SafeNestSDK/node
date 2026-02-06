// =============================================================================
// Policy Configuration
// =============================================================================

export interface ThresholdConfig {
    enabled: boolean;
    minRiskScoreToFlag: number;
    minRiskScoreToBlock: number;
}

export interface BullyingPolicyConfig extends ThresholdConfig {
    autoModeration: boolean;
}

export interface GroomingPolicyConfig extends ThresholdConfig {
    requireAdultReview: boolean;
}

export interface SelfHarmPolicyConfig {
    enabled: boolean;
    minRiskScoreToAlert: number;
    provideResources: boolean;
    escalateImmediately: boolean;
}

export interface HateSpeechPolicyConfig extends ThresholdConfig {}

export interface ThreatsPolicyConfig extends ThresholdConfig {
    notifyAuthorities: boolean;
}

export interface SexualContentPolicyConfig extends ThresholdConfig {
    ageAppropriate: boolean;
}

export interface ViolencePolicyConfig extends ThresholdConfig {}

export interface EmotionMonitoringConfig {
    enabled: boolean;
    trackTrends: boolean;
    alertOnDistress: boolean;
}

export interface IncidentReportingConfig {
    enabled: boolean;
    anonymize: boolean;
    notifyParents: boolean;
}

export interface PolicyConfig {
    bullying: BullyingPolicyConfig;
    grooming: GroomingPolicyConfig;
    selfHarm: SelfHarmPolicyConfig;
    hateSpeech: HateSpeechPolicyConfig;
    threats: ThreatsPolicyConfig;
    sexualContent: SexualContentPolicyConfig;
    violence: ViolencePolicyConfig;
    emotionMonitoring: EmotionMonitoringConfig;
    incidentReporting: IncidentReportingConfig;
}

export interface PolicyConfigResponse {
    success: boolean;
    config?: PolicyConfig;
    message?: string;
}
