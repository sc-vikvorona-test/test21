import { UserRepository } from './entities/user/repository';
import { UserService } from './entities/user/service';
import { UserController } from './entities/user/controller';
import { OrganizationRepository } from './entities/organization/repository';
import { OrganizationService } from './entities/organization/service';
import { OrganizationController } from './entities/organization/controller';
import { WorkspaceRepository } from './entities/workspace/repository';
import { WorkspaceService } from './entities/workspace/service';
import { WorkspaceController } from './entities/workspace/controller';
import { ProjectRepository } from './entities/project/repository';
import { ProjectService } from './entities/project/service';
import { ProjectController } from './entities/project/controller';
import { RepositoryRepository } from './entities/repository/repository';
import { RepositoryService } from './entities/repository/service';
import { RepositoryController } from './entities/repository/controller';
import { PullRequestRepository } from './entities/pullRequest/repository';
import { PullRequestService } from './entities/pullRequest/service';
import { PullRequestController } from './entities/pullRequest/controller';
import { IssueRepository } from './entities/issue/repository';
import { IssueService } from './entities/issue/service';
import { IssueController } from './entities/issue/controller';
import { CommentRepository } from './entities/comment/repository';
import { CommentService } from './entities/comment/service';
import { CommentController } from './entities/comment/controller';
import { ReviewRepository } from './entities/review/repository';
import { ReviewService } from './entities/review/service';
import { ReviewController } from './entities/review/controller';
import { NotificationRepository } from './entities/notification/repository';
import { NotificationService } from './entities/notification/service';
import { NotificationController } from './entities/notification/controller';
import { TeamRepository } from './entities/team/repository';
import { TeamService } from './entities/team/service';
import { TeamController } from './entities/team/controller';
import { MembershipRepository } from './entities/membership/repository';
import { MembershipService } from './entities/membership/service';
import { MembershipController } from './entities/membership/controller';
import { InvitationRepository } from './entities/invitation/repository';
import { InvitationService } from './entities/invitation/service';
import { InvitationController } from './entities/invitation/controller';
import { ApiKeyRepository } from './entities/apiKey/repository';
import { ApiKeyService } from './entities/apiKey/service';
import { ApiKeyController } from './entities/apiKey/controller';
import { WebhookRepository } from './entities/webhook/repository';
import { WebhookService } from './entities/webhook/service';
import { WebhookController } from './entities/webhook/controller';
import { DeploymentRepository } from './entities/deployment/repository';
import { DeploymentService } from './entities/deployment/service';
import { DeploymentController } from './entities/deployment/controller';
import { EnvironmentRepository } from './entities/environment/repository';
import { EnvironmentService } from './entities/environment/service';
import { EnvironmentController } from './entities/environment/controller';
import { AuditLogRepository } from './entities/auditLog/repository';
import { AuditLogService } from './entities/auditLog/service';
import { AuditLogController } from './entities/auditLog/controller';
import { BillingAccountRepository } from './entities/billingAccount/repository';
import { BillingAccountService } from './entities/billingAccount/service';
import { BillingAccountController } from './entities/billingAccount/controller';
import { InvoiceRepository } from './entities/invoice/repository';
import { InvoiceService } from './entities/invoice/service';
import { InvoiceController } from './entities/invoice/controller';
import { SubscriptionRepository } from './entities/subscription/repository';
import { SubscriptionService } from './entities/subscription/service';
import { SubscriptionController } from './entities/subscription/controller';
import { UsageRecordRepository } from './entities/usageRecord/repository';
import { UsageRecordService } from './entities/usageRecord/service';
import { UsageRecordController } from './entities/usageRecord/controller';
import { SessionRepository } from './entities/session/repository';
import { SessionService } from './entities/session/service';
import { SessionController } from './entities/session/controller';
import { OauthGrantRepository } from './entities/oauthGrant/repository';
import { OauthGrantService } from './entities/oauthGrant/service';
import { OauthGrantController } from './entities/oauthGrant/controller';
import { FeatureFlagRepository } from './entities/featureFlag/repository';
import { FeatureFlagService } from './entities/featureFlag/service';
import { FeatureFlagController } from './entities/featureFlag/controller';
import { TaskRepository } from './entities/task/repository';
import { TaskService } from './entities/task/service';
import { TaskController } from './entities/task/controller';
import { LabelRepository } from './entities/label/repository';
import { LabelService } from './entities/label/service';
import { LabelController } from './entities/label/controller';
import { MilestoneRepository } from './entities/milestone/repository';
import { MilestoneService } from './entities/milestone/service';
import { MilestoneController } from './entities/milestone/controller';
import { BranchRepository } from './entities/branch/repository';
import { BranchService } from './entities/branch/service';
import { BranchController } from './entities/branch/controller';
import { TagRepository } from './entities/tag/repository';
import { TagService } from './entities/tag/service';
import { TagController } from './entities/tag/controller';
import { ReleaseRepository } from './entities/release/repository';
import { ReleaseService } from './entities/release/service';
import { ReleaseController } from './entities/release/controller';
import { AssetRepository } from './entities/asset/repository';
import { AssetService } from './entities/asset/service';
import { AssetController } from './entities/asset/controller';
import { AttachmentRepository } from './entities/attachment/repository';
import { AttachmentService } from './entities/attachment/service';
import { AttachmentController } from './entities/attachment/controller';
import { AlertRepository } from './entities/alert/repository';
import { AlertService } from './entities/alert/service';
import { AlertController } from './entities/alert/controller';
import { LogEntryRepository } from './entities/logEntry/repository';
import { LogEntryService } from './entities/logEntry/service';
import { LogEntryController } from './entities/logEntry/controller';
import { MetricRepository } from './entities/metric/repository';
import { MetricService } from './entities/metric/service';
import { MetricController } from './entities/metric/controller';
import { EventRecordRepository } from './entities/eventRecord/repository';
import { EventRecordService } from './entities/eventRecord/service';
import { EventRecordController } from './entities/eventRecord/controller';
import { SpanRepository } from './entities/span/repository';
import { SpanService } from './entities/span/service';
import { SpanController } from './entities/span/controller';
import { TraceRepository } from './entities/trace/repository';
import { TraceService } from './entities/trace/service';
import { TraceController } from './entities/trace/controller';
import { BackupRepository } from './entities/backup/repository';
import { BackupService } from './entities/backup/service';
import { BackupController } from './entities/backup/controller';
import { SnapshotRepository } from './entities/snapshot/repository';
import { SnapshotService } from './entities/snapshot/service';
import { SnapshotController } from './entities/snapshot/controller';
import { ScheduleRepository } from './entities/schedule/repository';
import { ScheduleService } from './entities/schedule/service';
import { ScheduleController } from './entities/schedule/controller';
import { CronJobRepository } from './entities/cronJob/repository';
import { CronJobService } from './entities/cronJob/service';
import { CronJobController } from './entities/cronJob/controller';
import { SecretRepository } from './entities/secret/repository';
import { SecretService } from './entities/secret/service';
import { SecretController } from './entities/secret/controller';
import { CredentialRepository } from './entities/credential/repository';
import { CredentialService } from './entities/credential/service';
import { CredentialController } from './entities/credential/controller';
import { CertificateRepository } from './entities/certificate/repository';
import { CertificateService } from './entities/certificate/service';
import { CertificateController } from './entities/certificate/controller';
import { SshKeyRepository } from './entities/sshKey/repository';
import { SshKeyService } from './entities/sshKey/service';
import { SshKeyController } from './entities/sshKey/controller';
import { GpgKeyRepository } from './entities/gpgKey/repository';
import { GpgKeyService } from './entities/gpgKey/service';
import { GpgKeyController } from './entities/gpgKey/controller';
import { DeployKeyRepository } from './entities/deployKey/repository';
import { DeployKeyService } from './entities/deployKey/service';
import { DeployKeyController } from './entities/deployKey/controller';
import { PipelineRepository } from './entities/pipeline/repository';
import { PipelineService } from './entities/pipeline/service';
import { PipelineController } from './entities/pipeline/controller';
import { PipelineRunRepository } from './entities/pipelineRun/repository';
import { PipelineRunService } from './entities/pipelineRun/service';
import { PipelineRunController } from './entities/pipelineRun/controller';
import { RunnerRepository } from './entities/runner/repository';
import { RunnerService } from './entities/runner/service';
import { RunnerController } from './entities/runner/controller';
import { RunnerGroupRepository } from './entities/runnerGroup/repository';
import { RunnerGroupService } from './entities/runnerGroup/service';
import { RunnerGroupController } from './entities/runnerGroup/controller';
import { ArtifactRepository } from './entities/artifact/repository';
import { ArtifactService } from './entities/artifact/service';
import { ArtifactController } from './entities/artifact/controller';
import { CacheEntryRepository } from './entities/cacheEntry/repository';
import { CacheEntryService } from './entities/cacheEntry/service';
import { CacheEntryController } from './entities/cacheEntry/controller';
import { ChannelRepository } from './entities/channel/repository';
import { ChannelService } from './entities/channel/service';
import { ChannelController } from './entities/channel/controller';
import { MessageEntryRepository } from './entities/messageEntry/repository';
import { MessageEntryService } from './entities/messageEntry/service';
import { MessageEntryController } from './entities/messageEntry/controller';
import { ThreadRepository } from './entities/thread/repository';
import { ThreadService } from './entities/thread/service';
import { ThreadController } from './entities/thread/controller';
import { ReactionRepository } from './entities/reaction/repository';
import { ReactionService } from './entities/reaction/service';
import { ReactionController } from './entities/reaction/controller';
import { MentionRepository } from './entities/mention/repository';
import { MentionService } from './entities/mention/service';
import { MentionController } from './entities/mention/controller';
import { ApplicationRepository } from './entities/application/repository';
import { ApplicationService } from './entities/application/service';
import { ApplicationController } from './entities/application/controller';
import { IntegrationRepository } from './entities/integration/repository';
import { IntegrationService } from './entities/integration/service';
import { IntegrationController } from './entities/integration/controller';
import { HookDeliveryRepository } from './entities/hookDelivery/repository';
import { HookDeliveryService } from './entities/hookDelivery/service';
import { HookDeliveryController } from './entities/hookDelivery/controller';
import { PolicyRepository } from './entities/policy/repository';
import { PolicyService } from './entities/policy/service';
import { PolicyController } from './entities/policy/controller';
import { PolicyRuleRepository } from './entities/policyRule/repository';
import { PolicyRuleService } from './entities/policyRule/service';
import { PolicyRuleController } from './entities/policyRule/controller';

export * from './entities/user/model';
export * from './entities/user/repository';
export * from './entities/user/service';
export * from './entities/user/controller';
export * from './entities/user/validator';
export * from './entities/organization/model';
export * from './entities/organization/repository';
export * from './entities/organization/service';
export * from './entities/organization/controller';
export * from './entities/organization/validator';
export * from './entities/workspace/model';
export * from './entities/workspace/repository';
export * from './entities/workspace/service';
export * from './entities/workspace/controller';
export * from './entities/workspace/validator';
export * from './entities/project/model';
export * from './entities/project/repository';
export * from './entities/project/service';
export * from './entities/project/controller';
export * from './entities/project/validator';
export * from './entities/repository/model';
export * from './entities/repository/repository';
export * from './entities/repository/service';
export * from './entities/repository/controller';
export * from './entities/repository/validator';
export * from './entities/pullRequest/model';
export * from './entities/pullRequest/repository';
export * from './entities/pullRequest/service';
export * from './entities/pullRequest/controller';
export * from './entities/pullRequest/validator';
export * from './entities/issue/model';
export * from './entities/issue/repository';
export * from './entities/issue/service';
export * from './entities/issue/controller';
export * from './entities/issue/validator';
export * from './entities/comment/model';
export * from './entities/comment/repository';
export * from './entities/comment/service';
export * from './entities/comment/controller';
export * from './entities/comment/validator';
export * from './entities/review/model';
export * from './entities/review/repository';
export * from './entities/review/service';
export * from './entities/review/controller';
export * from './entities/review/validator';
export * from './entities/notification/model';
export * from './entities/notification/repository';
export * from './entities/notification/service';
export * from './entities/notification/controller';
export * from './entities/notification/validator';
export * from './entities/team/model';
export * from './entities/team/repository';
export * from './entities/team/service';
export * from './entities/team/controller';
export * from './entities/team/validator';
export * from './entities/membership/model';
export * from './entities/membership/repository';
export * from './entities/membership/service';
export * from './entities/membership/controller';
export * from './entities/membership/validator';
export * from './entities/invitation/model';
export * from './entities/invitation/repository';
export * from './entities/invitation/service';
export * from './entities/invitation/controller';
export * from './entities/invitation/validator';
export * from './entities/apiKey/model';
export * from './entities/apiKey/repository';
export * from './entities/apiKey/service';
export * from './entities/apiKey/controller';
export * from './entities/apiKey/validator';
export * from './entities/webhook/model';
export * from './entities/webhook/repository';
export * from './entities/webhook/service';
export * from './entities/webhook/controller';
export * from './entities/webhook/validator';
export * from './entities/deployment/model';
export * from './entities/deployment/repository';
export * from './entities/deployment/service';
export * from './entities/deployment/controller';
export * from './entities/deployment/validator';
export * from './entities/environment/model';
export * from './entities/environment/repository';
export * from './entities/environment/service';
export * from './entities/environment/controller';
export * from './entities/environment/validator';
export * from './entities/auditLog/model';
export * from './entities/auditLog/repository';
export * from './entities/auditLog/service';
export * from './entities/auditLog/controller';
export * from './entities/auditLog/validator';
export * from './entities/billingAccount/model';
export * from './entities/billingAccount/repository';
export * from './entities/billingAccount/service';
export * from './entities/billingAccount/controller';
export * from './entities/billingAccount/validator';
export * from './entities/invoice/model';
export * from './entities/invoice/repository';
export * from './entities/invoice/service';
export * from './entities/invoice/controller';
export * from './entities/invoice/validator';
export * from './entities/subscription/model';
export * from './entities/subscription/repository';
export * from './entities/subscription/service';
export * from './entities/subscription/controller';
export * from './entities/subscription/validator';
export * from './entities/usageRecord/model';
export * from './entities/usageRecord/repository';
export * from './entities/usageRecord/service';
export * from './entities/usageRecord/controller';
export * from './entities/usageRecord/validator';
export * from './entities/session/model';
export * from './entities/session/repository';
export * from './entities/session/service';
export * from './entities/session/controller';
export * from './entities/session/validator';
export * from './entities/oauthGrant/model';
export * from './entities/oauthGrant/repository';
export * from './entities/oauthGrant/service';
export * from './entities/oauthGrant/controller';
export * from './entities/oauthGrant/validator';
export * from './entities/featureFlag/model';
export * from './entities/featureFlag/repository';
export * from './entities/featureFlag/service';
export * from './entities/featureFlag/controller';
export * from './entities/featureFlag/validator';
export * from './entities/task/model';
export * from './entities/task/repository';
export * from './entities/task/service';
export * from './entities/task/controller';
export * from './entities/task/validator';
export * from './entities/label/model';
export * from './entities/label/repository';
export * from './entities/label/service';
export * from './entities/label/controller';
export * from './entities/label/validator';
export * from './entities/milestone/model';
export * from './entities/milestone/repository';
export * from './entities/milestone/service';
export * from './entities/milestone/controller';
export * from './entities/milestone/validator';
export * from './entities/branch/model';
export * from './entities/branch/repository';
export * from './entities/branch/service';
export * from './entities/branch/controller';
export * from './entities/branch/validator';
export * from './entities/tag/model';
export * from './entities/tag/repository';
export * from './entities/tag/service';
export * from './entities/tag/controller';
export * from './entities/tag/validator';
export * from './entities/release/model';
export * from './entities/release/repository';
export * from './entities/release/service';
export * from './entities/release/controller';
export * from './entities/release/validator';
export * from './entities/asset/model';
export * from './entities/asset/repository';
export * from './entities/asset/service';
export * from './entities/asset/controller';
export * from './entities/asset/validator';
export * from './entities/attachment/model';
export * from './entities/attachment/repository';
export * from './entities/attachment/service';
export * from './entities/attachment/controller';
export * from './entities/attachment/validator';
export * from './entities/alert/model';
export * from './entities/alert/repository';
export * from './entities/alert/service';
export * from './entities/alert/controller';
export * from './entities/alert/validator';
export * from './entities/logEntry/model';
export * from './entities/logEntry/repository';
export * from './entities/logEntry/service';
export * from './entities/logEntry/controller';
export * from './entities/logEntry/validator';
export * from './entities/metric/model';
export * from './entities/metric/repository';
export * from './entities/metric/service';
export * from './entities/metric/controller';
export * from './entities/metric/validator';
export * from './entities/eventRecord/model';
export * from './entities/eventRecord/repository';
export * from './entities/eventRecord/service';
export * from './entities/eventRecord/controller';
export * from './entities/eventRecord/validator';
export * from './entities/span/model';
export * from './entities/span/repository';
export * from './entities/span/service';
export * from './entities/span/controller';
export * from './entities/span/validator';
export * from './entities/trace/model';
export * from './entities/trace/repository';
export * from './entities/trace/service';
export * from './entities/trace/controller';
export * from './entities/trace/validator';
export * from './entities/backup/model';
export * from './entities/backup/repository';
export * from './entities/backup/service';
export * from './entities/backup/controller';
export * from './entities/backup/validator';
export * from './entities/snapshot/model';
export * from './entities/snapshot/repository';
export * from './entities/snapshot/service';
export * from './entities/snapshot/controller';
export * from './entities/snapshot/validator';
export * from './entities/schedule/model';
export * from './entities/schedule/repository';
export * from './entities/schedule/service';
export * from './entities/schedule/controller';
export * from './entities/schedule/validator';
export * from './entities/cronJob/model';
export * from './entities/cronJob/repository';
export * from './entities/cronJob/service';
export * from './entities/cronJob/controller';
export * from './entities/cronJob/validator';
export * from './entities/secret/model';
export * from './entities/secret/repository';
export * from './entities/secret/service';
export * from './entities/secret/controller';
export * from './entities/secret/validator';
export * from './entities/credential/model';
export * from './entities/credential/repository';
export * from './entities/credential/service';
export * from './entities/credential/controller';
export * from './entities/credential/validator';
export * from './entities/certificate/model';
export * from './entities/certificate/repository';
export * from './entities/certificate/service';
export * from './entities/certificate/controller';
export * from './entities/certificate/validator';
export * from './entities/sshKey/model';
export * from './entities/sshKey/repository';
export * from './entities/sshKey/service';
export * from './entities/sshKey/controller';
export * from './entities/sshKey/validator';
export * from './entities/gpgKey/model';
export * from './entities/gpgKey/repository';
export * from './entities/gpgKey/service';
export * from './entities/gpgKey/controller';
export * from './entities/gpgKey/validator';
export * from './entities/deployKey/model';
export * from './entities/deployKey/repository';
export * from './entities/deployKey/service';
export * from './entities/deployKey/controller';
export * from './entities/deployKey/validator';
export * from './entities/pipeline/model';
export * from './entities/pipeline/repository';
export * from './entities/pipeline/service';
export * from './entities/pipeline/controller';
export * from './entities/pipeline/validator';
export * from './entities/pipelineRun/model';
export * from './entities/pipelineRun/repository';
export * from './entities/pipelineRun/service';
export * from './entities/pipelineRun/controller';
export * from './entities/pipelineRun/validator';
export * from './entities/runner/model';
export * from './entities/runner/repository';
export * from './entities/runner/service';
export * from './entities/runner/controller';
export * from './entities/runner/validator';
export * from './entities/runnerGroup/model';
export * from './entities/runnerGroup/repository';
export * from './entities/runnerGroup/service';
export * from './entities/runnerGroup/controller';
export * from './entities/runnerGroup/validator';
export * from './entities/artifact/model';
export * from './entities/artifact/repository';
export * from './entities/artifact/service';
export * from './entities/artifact/controller';
export * from './entities/artifact/validator';
export * from './entities/cacheEntry/model';
export * from './entities/cacheEntry/repository';
export * from './entities/cacheEntry/service';
export * from './entities/cacheEntry/controller';
export * from './entities/cacheEntry/validator';
export * from './entities/channel/model';
export * from './entities/channel/repository';
export * from './entities/channel/service';
export * from './entities/channel/controller';
export * from './entities/channel/validator';
export * from './entities/messageEntry/model';
export * from './entities/messageEntry/repository';
export * from './entities/messageEntry/service';
export * from './entities/messageEntry/controller';
export * from './entities/messageEntry/validator';
export * from './entities/thread/model';
export * from './entities/thread/repository';
export * from './entities/thread/service';
export * from './entities/thread/controller';
export * from './entities/thread/validator';
export * from './entities/reaction/model';
export * from './entities/reaction/repository';
export * from './entities/reaction/service';
export * from './entities/reaction/controller';
export * from './entities/reaction/validator';
export * from './entities/mention/model';
export * from './entities/mention/repository';
export * from './entities/mention/service';
export * from './entities/mention/controller';
export * from './entities/mention/validator';
export * from './entities/application/model';
export * from './entities/application/repository';
export * from './entities/application/service';
export * from './entities/application/controller';
export * from './entities/application/validator';
export * from './entities/integration/model';
export * from './entities/integration/repository';
export * from './entities/integration/service';
export * from './entities/integration/controller';
export * from './entities/integration/validator';
export * from './entities/hookDelivery/model';
export * from './entities/hookDelivery/repository';
export * from './entities/hookDelivery/service';
export * from './entities/hookDelivery/controller';
export * from './entities/hookDelivery/validator';
export * from './entities/policy/model';
export * from './entities/policy/repository';
export * from './entities/policy/service';
export * from './entities/policy/controller';
export * from './entities/policy/validator';
export * from './entities/policyRule/model';
export * from './entities/policyRule/repository';
export * from './entities/policyRule/service';
export * from './entities/policyRule/controller';
export * from './entities/policyRule/validator';

import type { HttpRoute } from './entities/user/controller';

export function buildRoutes(): HttpRoute[] {
  const routes: HttpRoute[] = [];
{
  const repo = new UserRepository();
  const service = new UserService({ repository: repo });
  const ctrl = new UserController(service);
  ctrl.register(routes);
}

{
  const repo = new OrganizationRepository();
  const service = new OrganizationService({ repository: repo });
  const ctrl = new OrganizationController(service);
  ctrl.register(routes);
}

{
  const repo = new WorkspaceRepository();
  const service = new WorkspaceService({ repository: repo });
  const ctrl = new WorkspaceController(service);
  ctrl.register(routes);
}

{
  const repo = new ProjectRepository();
  const service = new ProjectService({ repository: repo });
  const ctrl = new ProjectController(service);
  ctrl.register(routes);
}

{
  const repo = new RepositoryRepository();
  const service = new RepositoryService({ repository: repo });
  const ctrl = new RepositoryController(service);
  ctrl.register(routes);
}

{
  const repo = new PullRequestRepository();
  const service = new PullRequestService({ repository: repo });
  const ctrl = new PullRequestController(service);
  ctrl.register(routes);
}

{
  const repo = new IssueRepository();
  const service = new IssueService({ repository: repo });
  const ctrl = new IssueController(service);
  ctrl.register(routes);
}

{
  const repo = new CommentRepository();
  const service = new CommentService({ repository: repo });
  const ctrl = new CommentController(service);
  ctrl.register(routes);
}

{
  const repo = new ReviewRepository();
  const service = new ReviewService({ repository: repo });
  const ctrl = new ReviewController(service);
  ctrl.register(routes);
}

{
  const repo = new NotificationRepository();
  const service = new NotificationService({ repository: repo });
  const ctrl = new NotificationController(service);
  ctrl.register(routes);
}

{
  const repo = new TeamRepository();
  const service = new TeamService({ repository: repo });
  const ctrl = new TeamController(service);
  ctrl.register(routes);
}

{
  const repo = new MembershipRepository();
  const service = new MembershipService({ repository: repo });
  const ctrl = new MembershipController(service);
  ctrl.register(routes);
}

{
  const repo = new InvitationRepository();
  const service = new InvitationService({ repository: repo });
  const ctrl = new InvitationController(service);
  ctrl.register(routes);
}

{
  const repo = new ApiKeyRepository();
  const service = new ApiKeyService({ repository: repo });
  const ctrl = new ApiKeyController(service);
  ctrl.register(routes);
}

{
  const repo = new WebhookRepository();
  const service = new WebhookService({ repository: repo });
  const ctrl = new WebhookController(service);
  ctrl.register(routes);
}

{
  const repo = new DeploymentRepository();
  const service = new DeploymentService({ repository: repo });
  const ctrl = new DeploymentController(service);
  ctrl.register(routes);
}

{
  const repo = new EnvironmentRepository();
  const service = new EnvironmentService({ repository: repo });
  const ctrl = new EnvironmentController(service);
  ctrl.register(routes);
}

{
  const repo = new AuditLogRepository();
  const service = new AuditLogService({ repository: repo });
  const ctrl = new AuditLogController(service);
  ctrl.register(routes);
}

{
  const repo = new BillingAccountRepository();
  const service = new BillingAccountService({ repository: repo });
  const ctrl = new BillingAccountController(service);
  ctrl.register(routes);
}

{
  const repo = new InvoiceRepository();
  const service = new InvoiceService({ repository: repo });
  const ctrl = new InvoiceController(service);
  ctrl.register(routes);
}

{
  const repo = new SubscriptionRepository();
  const service = new SubscriptionService({ repository: repo });
  const ctrl = new SubscriptionController(service);
  ctrl.register(routes);
}

{
  const repo = new UsageRecordRepository();
  const service = new UsageRecordService({ repository: repo });
  const ctrl = new UsageRecordController(service);
  ctrl.register(routes);
}

{
  const repo = new SessionRepository();
  const service = new SessionService({ repository: repo });
  const ctrl = new SessionController(service);
  ctrl.register(routes);
}

{
  const repo = new OauthGrantRepository();
  const service = new OauthGrantService({ repository: repo });
  const ctrl = new OauthGrantController(service);
  ctrl.register(routes);
}

{
  const repo = new FeatureFlagRepository();
  const service = new FeatureFlagService({ repository: repo });
  const ctrl = new FeatureFlagController(service);
  ctrl.register(routes);
}

{
  const repo = new TaskRepository();
  const service = new TaskService({ repository: repo });
  const ctrl = new TaskController(service);
  ctrl.register(routes);
}

{
  const repo = new LabelRepository();
  const service = new LabelService({ repository: repo });
  const ctrl = new LabelController(service);
  ctrl.register(routes);
}

{
  const repo = new MilestoneRepository();
  const service = new MilestoneService({ repository: repo });
  const ctrl = new MilestoneController(service);
  ctrl.register(routes);
}

{
  const repo = new BranchRepository();
  const service = new BranchService({ repository: repo });
  const ctrl = new BranchController(service);
  ctrl.register(routes);
}

{
  const repo = new TagRepository();
  const service = new TagService({ repository: repo });
  const ctrl = new TagController(service);
  ctrl.register(routes);
}

{
  const repo = new ReleaseRepository();
  const service = new ReleaseService({ repository: repo });
  const ctrl = new ReleaseController(service);
  ctrl.register(routes);
}

{
  const repo = new AssetRepository();
  const service = new AssetService({ repository: repo });
  const ctrl = new AssetController(service);
  ctrl.register(routes);
}

{
  const repo = new AttachmentRepository();
  const service = new AttachmentService({ repository: repo });
  const ctrl = new AttachmentController(service);
  ctrl.register(routes);
}

{
  const repo = new AlertRepository();
  const service = new AlertService({ repository: repo });
  const ctrl = new AlertController(service);
  ctrl.register(routes);
}

{
  const repo = new LogEntryRepository();
  const service = new LogEntryService({ repository: repo });
  const ctrl = new LogEntryController(service);
  ctrl.register(routes);
}

{
  const repo = new MetricRepository();
  const service = new MetricService({ repository: repo });
  const ctrl = new MetricController(service);
  ctrl.register(routes);
}

{
  const repo = new EventRecordRepository();
  const service = new EventRecordService({ repository: repo });
  const ctrl = new EventRecordController(service);
  ctrl.register(routes);
}

{
  const repo = new SpanRepository();
  const service = new SpanService({ repository: repo });
  const ctrl = new SpanController(service);
  ctrl.register(routes);
}

{
  const repo = new TraceRepository();
  const service = new TraceService({ repository: repo });
  const ctrl = new TraceController(service);
  ctrl.register(routes);
}

{
  const repo = new BackupRepository();
  const service = new BackupService({ repository: repo });
  const ctrl = new BackupController(service);
  ctrl.register(routes);
}

{
  const repo = new SnapshotRepository();
  const service = new SnapshotService({ repository: repo });
  const ctrl = new SnapshotController(service);
  ctrl.register(routes);
}

{
  const repo = new ScheduleRepository();
  const service = new ScheduleService({ repository: repo });
  const ctrl = new ScheduleController(service);
  ctrl.register(routes);
}

{
  const repo = new CronJobRepository();
  const service = new CronJobService({ repository: repo });
  const ctrl = new CronJobController(service);
  ctrl.register(routes);
}

{
  const repo = new SecretRepository();
  const service = new SecretService({ repository: repo });
  const ctrl = new SecretController(service);
  ctrl.register(routes);
}

{
  const repo = new CredentialRepository();
  const service = new CredentialService({ repository: repo });
  const ctrl = new CredentialController(service);
  ctrl.register(routes);
}

{
  const repo = new CertificateRepository();
  const service = new CertificateService({ repository: repo });
  const ctrl = new CertificateController(service);
  ctrl.register(routes);
}

{
  const repo = new SshKeyRepository();
  const service = new SshKeyService({ repository: repo });
  const ctrl = new SshKeyController(service);
  ctrl.register(routes);
}

{
  const repo = new GpgKeyRepository();
  const service = new GpgKeyService({ repository: repo });
  const ctrl = new GpgKeyController(service);
  ctrl.register(routes);
}

{
  const repo = new DeployKeyRepository();
  const service = new DeployKeyService({ repository: repo });
  const ctrl = new DeployKeyController(service);
  ctrl.register(routes);
}

{
  const repo = new PipelineRepository();
  const service = new PipelineService({ repository: repo });
  const ctrl = new PipelineController(service);
  ctrl.register(routes);
}

{
  const repo = new PipelineRunRepository();
  const service = new PipelineRunService({ repository: repo });
  const ctrl = new PipelineRunController(service);
  ctrl.register(routes);
}

{
  const repo = new RunnerRepository();
  const service = new RunnerService({ repository: repo });
  const ctrl = new RunnerController(service);
  ctrl.register(routes);
}

{
  const repo = new RunnerGroupRepository();
  const service = new RunnerGroupService({ repository: repo });
  const ctrl = new RunnerGroupController(service);
  ctrl.register(routes);
}

{
  const repo = new ArtifactRepository();
  const service = new ArtifactService({ repository: repo });
  const ctrl = new ArtifactController(service);
  ctrl.register(routes);
}

{
  const repo = new CacheEntryRepository();
  const service = new CacheEntryService({ repository: repo });
  const ctrl = new CacheEntryController(service);
  ctrl.register(routes);
}

{
  const repo = new ChannelRepository();
  const service = new ChannelService({ repository: repo });
  const ctrl = new ChannelController(service);
  ctrl.register(routes);
}

{
  const repo = new MessageEntryRepository();
  const service = new MessageEntryService({ repository: repo });
  const ctrl = new MessageEntryController(service);
  ctrl.register(routes);
}

{
  const repo = new ThreadRepository();
  const service = new ThreadService({ repository: repo });
  const ctrl = new ThreadController(service);
  ctrl.register(routes);
}

{
  const repo = new ReactionRepository();
  const service = new ReactionService({ repository: repo });
  const ctrl = new ReactionController(service);
  ctrl.register(routes);
}

{
  const repo = new MentionRepository();
  const service = new MentionService({ repository: repo });
  const ctrl = new MentionController(service);
  ctrl.register(routes);
}

{
  const repo = new ApplicationRepository();
  const service = new ApplicationService({ repository: repo });
  const ctrl = new ApplicationController(service);
  ctrl.register(routes);
}

{
  const repo = new IntegrationRepository();
  const service = new IntegrationService({ repository: repo });
  const ctrl = new IntegrationController(service);
  ctrl.register(routes);
}

{
  const repo = new HookDeliveryRepository();
  const service = new HookDeliveryService({ repository: repo });
  const ctrl = new HookDeliveryController(service);
  ctrl.register(routes);
}

{
  const repo = new PolicyRepository();
  const service = new PolicyService({ repository: repo });
  const ctrl = new PolicyController(service);
  ctrl.register(routes);
}

{
  const repo = new PolicyRuleRepository();
  const service = new PolicyRuleService({ repository: repo });
  const ctrl = new PolicyRuleController(service);
  ctrl.register(routes);
}
  return routes;
}
