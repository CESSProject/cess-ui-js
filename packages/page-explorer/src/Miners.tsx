import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import RcTable from "@polkadot/react-components/RcTable";
import Icon from "@polkadot/react-components/Icon";
import { api } from "@polkadot/react-api";
import StorageGroup from "./components/StorageGroup";
import _ from "lodash"
import {
  formatterCurrency,
  formatterCurrencyStr,
  formatterSize,
  formatterSizeFromMB
} from "@polkadot/app-explorer/utils";

interface Props{
  className?: string
}

function Miners({className}: Props): React.ReactElement<Props>{
  const [minerData, setMinerData] = useState<any>({})
  const [minerList, setMinerList] = useState<any[]>([]);

  useEffect(()=>{
    (async (): Promise<void> =>{
      const unsub = await api.query.sminer.minerStatValue((res)=>{
        if(res){
          let info:any = res.toJSON();
          let stakingObj = formatterCurrency(info.staking);
          info.stakingMoney = stakingObj.money;
          info.stakingSuffix = stakingObj.suffix;
          let minerRewardObj = formatterCurrency(info.minerReward);
          info.minerRewardMoney = minerRewardObj.money;
          info.minerRewardSuffix = minerRewardObj.suffix;
          setMinerData(info);
        }
      });
    })().catch(console.error);
  }, [])

  useEffect(()=>{
    (async (): Promise<void> =>{
      const MinerKeys = await api.query.sminer.minerTable.keys();
      const entries = await api.query.sminer.minerTable.entries();
      let list:any[]= [];
      entries.forEach(([key, entry]) => {
        // console.log(key.args,'key arguments:', key.args.map((k) => k.toHuman()),'rrrrrrrrr',key);
        // console.log('     exposure:', entry.toHuman());
        let minerId = _.get(key.args.map((k) => k.toHuman()), `0`);
        let humanObj = entry.toJSON();
        list.push(_.assign(humanObj, { minerId }));
      });
      list = _.sortBy(list, v=> _.toNumber(v.minerId));
      setMinerList(list);
    })().catch(console.error);
  }, [])

  const columns = React.useMemo(()=> [
    {Header: 'miner ID', accessor: 'minerId',Cell: ({row}) => (
      <a href={`#/explorer/query/${row.values.minerId}/${undefined}`} >{row.values.minerId}</a>
    )},
    {Header: 'address1', accessor: 'address',Cell: ({row}) => (
       <a href={`#/explorer/query/${row.values.address}/${undefined}`} >{row.values.address}</a>
     )},
    {Header: 'address2', accessor: 'beneficiary',Cell: ({row}) => (
       <a href={`#/explorer/query/${row.values.beneficiary}/${undefined}`} >{row.values.beneficiary}</a>
    )},
    {Header: 'total storage', accessor: 'totalStorage', Cell: ({row}) => (
       <span>{ formatterSizeFromMB(row.values.totalStorage)}</span>
    )},
    // {Header: 'Average Daily Data Traffic (In)', accessor: 'averageDailyDataTrafficIn'},
    // {Header: 'Average Daily Data Traffic (Out)', accessor: 'averageDailyDataTrafficOut'},
    {Header: 'mining reward', accessor: 'miningReward', Cell: ({row}) => (
       <span>{ formatterCurrencyStr(row.values.miningReward)}</span>
    )},
    // {Header: 'Status', accessor: 'status'},
  ], [])

  return (
    <div className={`${className} miners`}>
      <div className={"miners-info"}>
        <div className={"miners-info-details"}>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total miners</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.totalMiners}</span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>active miners</span>
            <span className={"miners-info-details-block-item"}> {minerData && minerData.activeMiners}</span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>staking</span>
            <span className={"miners-info-details-block-item"}>{ minerData && minerData.stakingMoney } <span className={"unit"}>{minerData && minerData.stakingSuffix}</span></span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>mining reward</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.minerRewardMoney} <span className={"unit"}>{ minerData && minerData.minerRewardSuffix}</span></span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total number of files</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.sumFiles} </span>
          </div>
        </div>
        <StorageGroup />
      </div>
      <div className={"miners-table"}>
        <div className={"miners-title"}>
          <Icon className='highlight--color' icon='dot-circle'/>
          <span>miners</span>
        </div>
        <div className={"miners-table-info"}>
          <RcTable columns={columns} data={minerList}/>
        </div>

      </div>

    </div>
  )
}

export default React.memo(styled(Miners)`
  margin-top: -50px;
  height: 100%;
  .miners-info{
    border-radius: 6px;
    display: flex;
    background: white;
    padding: 15px 1.5rem !important;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    &-details{
      width: 33%;
      display: flex;
      flex-wrap: wrap;
      &-block{
        display: flex;
        flex-direction: column;
        width: 50%;
        .label{
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #858585;
        }
        &-item{
          font-size: 28px;
          font-weight: 300;
          color: #464646;
          .unit{
            font-size: 18px;
          }
        }
      }
      .middle-block{
        margin: 50px 0;
      }
    }
  }
  .miners-table{
    margin-top: 20px;
    .miners-title{
      background: white;
      border-radius: 6px;
      padding: 15px 1.5rem;
      box-sizing: border-box;
      svg{
        vertical-align: baseline
      }
      >span{
        font-size: 24px;
        color: #464646;
        margin-left: 5px;
        vertical-align: baseline;
        display: inline-block;
        margin-top: -3px;
        font-weight: 100;
      }
    }
    &-info{
      margin-top: 4px;
      background: white;
      padding: 15px 1.5rem;
      box-sizing: border-box;
      border-radius: 6px;
    }
  }
`)
