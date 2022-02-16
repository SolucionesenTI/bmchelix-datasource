import { DataQuery, DataSourceJsonData } from '@grafana/data';
import * as Constants from 'Constants';

export interface BMCDataSourceQuery extends DataQuery {
  sourceType: string;
  sourceQuery: any;
}

export const defaultQuery: Partial<BMCDataSourceQuery> = {
  sourceType: Constants.SOURCE_TYPE_EVENT,
};

export enum InstancePlatform {
  ADE,
  ENTERPRISE,
}

/**
 * These are options configured for each DataSource instance
 */
export interface BMCDataSourceOptions extends DataSourceJsonData {
  timeField: string;
  interval: string;
  timeInterval: string;
  platformURL: string;
  platformQueue: string;
  tenantURL: string;
  tenantId: string;
}

export interface HelixSecureJsonData {
  accessKey?: string;
  secretKey?: string;
}

export const queryTypeOptions: any = [
  { sourceType: Constants.SOURCE_TYPE_EVENT, text: 'Events', value: 'event' },
  { sourceType: Constants.SOURCE_TYPE_METRIC, text: 'Metric', value: 'metric' },
  { sourceType: Constants.SOURCE_TYPE_CLOUD_SECURITY, text: 'CloudSecurity', value: 'cloudsecurity' },
  { sourceType: Constants.SOURCE_TYPE_LOG, text: 'Log', value: 'log' },
  //add here
];

export let queryTypeOptionRemedy: any = [
  { sourceType: Constants.SOURCE_TYPE_REMEDY, text: 'Service Management', value: 'remedy' },
];


export function validQueryType(queryType: string): boolean {
  switch (queryType) {
    case Constants.SOURCE_TYPE_EVENT:
    case Constants.SOURCE_TYPE_LOG:
    case Constants.SOURCE_TYPE_METRIC:
    case Constants.SOURCE_TYPE_CLOUD_SECURITY:
    case Constants.SOURCE_TYPE_SMARTGRAPH:
    case Constants.SOURCE_TYPE_REMEDY:
      return true;
    default:
      return false;
  }
}
