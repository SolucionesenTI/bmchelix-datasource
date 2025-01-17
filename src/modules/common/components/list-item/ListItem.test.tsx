import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { SelectableValue } from '@grafana/data';
import { ListItem } from './ListItem';

jest.mock('@grafana/ui', () => {
  const HorizontalGroupMock = () => <div></div>;
  HorizontalGroupMock.displayName = 'HorizontalGroup';
  const IconMock = ({ title }: { title: string }) => {
    return (
      <svg>
        <title> {title} </title>
      </svg>
    );
  };
  IconMock.displayName = 'Icon';
  const LabelMock = ({ description, label }: SelectableValue) => {
    return <div>{label}</div>;
  };
  LabelMock.displayName = 'Label';
  return {
    Icon: IconMock,
    Label: LabelMock,
    HorizontalGroup: HorizontalGroupMock,
  };
});

describe('ListItem', () => {
  afterEach(cleanup);
  it('should display tags', () => {
    const item: SelectableValue = { description: 'item', label: 'item' };
    const { container } = render(<ListItem item={item} iconName={'plus-circle'} onClick={() => ''} />);
    expect(container).toBeTruthy();
  });
});
