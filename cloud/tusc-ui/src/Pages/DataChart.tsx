import './DataChart.less'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Header } from 'semantic-ui-react';

type Props = {
  data: Array<any>,
  title: string,
}

export default class DataChart extends React.PureComponent<Props> {

  render() {

    const { data, title } = this.props

    return (
      <div className='DataChart'>
        <Header as='h3' textAlign='center'>{ title }</Header>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type='monotone' dataKey='value' stroke='#8884d8' dot={false} />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
