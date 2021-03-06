// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterOverlay, Input } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';
import _ from "lodash"
import { useTranslation } from './translate';
import request from "@polkadot/app-explorer/utils/reuqest";
import {httpUrl} from "@polkadot/apps-config/http";

interface Props {
  className?: string;
  value?: string;
}

interface State {
  value: string;
  isValid: boolean;
}

function stateFromValue (value: string): State {
  return {
    isValid: isHex(value, 256) || /^\d+$/.test(value),
    value
  };
}

function Query ({ className = '', value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, value }, setState] = useState(() => stateFromValue(propsValue || ''));

  const _setHash = useCallback(
    (value: string): void => setState(stateFromValue(value)),
    []
  );

  // const _onQuery = useCallback(
  //   (): void => {
  //     if (isValid && value.length !== 0) {
  //       window.location.hash = `/explorer/query/${value}`;
  //     }
  //   },
  //   [isValid, value]
  // );

  const _onQuery = useCallback(
    async (): Promise<void> => {
      let params = {hash: value};
      let res = await request.post({url:`${httpUrl}/api/scan/check_hash`, params});
      let type = _.get(res, 'data.hash_type');
      console.log(res, 'hash_typehash_typehash_type')
      if(!type){
        window.location.hash = `/explorer/query/${value}/${'extrinsic'}`;
        return;
      }
      if (value.length !== 0) {
        window.location.hash = `/explorer/query/${value}/${type}`;
      }
    },
    [value]
  );

  return (
    <FilterOverlay className={`ui--FilterOverlay hasOwnMaxWidth ${className}`}>
      <Input
        className='explorer--query'
        defaultValue={propsValue}
        isError={!isValid && value.length !== 0}
        onChange={_setHash}
        onEnter={_onQuery}
        placeholder={t<string>('Search by Block Hash / Extrinsics Hash / Address /  Miner ID')}
        withLabel={false}
      >
        <Button
          isSelected
          icon='search'
          onClick={_onQuery}
        />
      </Input>
    </FilterOverlay>
  );
}

export default React.memo(styled(Query)`
  &.explore-query-group{
    position: relative;
    .explorer--query{
      width: 40em;
      margin-left: 200px;
    }
  }
  .explorer--query {
    width: 20em;
  }
`);
