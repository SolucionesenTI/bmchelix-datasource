import React from 'react';
import { getDefaultTimeRange, TimeRange } from '@grafana/data';
import { EventDatasource } from '../../../../query-modules/event/EventDatasource';
import { ElasticsearchQuery } from '../../../../query-modules/event/eventTypes';
import { ElasticsearchProvider } from './ElasticsearchQueryContext';
import { InlineField, InlineFieldRow, Input, QueryField } from '@grafana/ui';
import { changeAliasPattern, changeQuery } from './state';
import { MetricAggregationsEditor } from './MetricAggregationsEditor';
import { BucketAggregationsEditor } from './BucketAggregationsEditor';
import { useDispatch } from '../../hooks/useStatelessReducer';
import { useNextId } from '../../hooks/useNextId';
import { metricAggregationConfig } from './MetricAggregationsEditor/utils';
import { useTypeahead, cleanText } from '../../hooks/useTypeahead';

export type ElasticQueryEditorProps = {
  query: ElasticsearchQuery;
  onQueryUpdate: Function;
  datasource: EventDatasource;
  range: TimeRange | undefined;
};

export const QueryEditor = ({ query, onQueryUpdate, datasource, range }: ElasticQueryEditorProps) => {
  const onChange = (query: ElasticsearchQuery) => {
    onQueryUpdate({ sourceQuery: query }, true);
  };
  return (
    <ElasticsearchProvider
      datasource={datasource}
      onChange={onChange}
      query={query}
      range={range || getDefaultTimeRange()}
    >
      <QueryEditorForm value={query} />
    </ElasticsearchProvider>
  );
};

interface Props {
  value: ElasticsearchQuery;
}

const QueryEditorForm = ({ value }: Props) => {
  const dispatch = useDispatch();
  const nextId = useNextId();
  const { onTypeAhead } = useTypeahead();
  // To be considered a time series query, the last bucked aggregation must be a Date Histogram
  const isTimeSeriesQuery = value.bucketAggs?.slice(-1)[0]?.type === 'date_histogram';

  const showBucketAggregationsEditor = value.metrics?.every(
    (metric) => !metricAggregationConfig[metric.type].isSingleMetric
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Query" labelWidth={17} grow>
          <QueryField
            query={value.query}
            // By default QueryField calls onChange if onBlur is not defined, this will trigger a rerender
            // And slate will claim the focus, making it impossible to leave the field.
            onBlur={() => {}}
            onChange={(query) => dispatch(changeQuery(query))}
            placeholder="Lucene Query"
            portalOrigin="elasticsearch"
            onTypeahead={onTypeAhead}
            cleanText={cleanText}
          />
        </InlineField>
        <InlineField
          label="Alias"
          labelWidth={15}
          disabled={!isTimeSeriesQuery}
          tooltip="Aliasing only works for timeseries queries (when the last group is 'Date Histogram'). For all other query types this field is ignored."
        >
          <Input
            id={`ES-query-${value.refId}_alias`}
            placeholder="Alias Pattern"
            onBlur={(e) => dispatch(changeAliasPattern(e.currentTarget.value))}
            defaultValue={value.alias}
          />
        </InlineField>
      </InlineFieldRow>

      <MetricAggregationsEditor nextId={nextId} />
      {showBucketAggregationsEditor && <BucketAggregationsEditor nextId={nextId} />}
    </>
  );
};
