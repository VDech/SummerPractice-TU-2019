import React, { ChangeEvent } from 'react'
import moment from 'moment'
import { connect, DispatchProp } from 'react-redux'
import { Page, } from '../_components/Page'
import { AppState } from '../_reducers';
import { Form, InputOnChangeData, Segment, Grid } from 'semantic-ui-react';
import { settingActions } from '../_actions/setting.actions';
import { dataActions } from '../_actions/data.actions';
import DataChart from './DataChart';

type Props = DispatchProp & {
  timeRange: number,
  refresh: number,
  speed: Array<any>,
  odo: Array<any>,
  temp: Array<any>,
}

class HomePage extends React.PureComponent<Props> {

  componentDidMount() {
    dataActions.init()
  }

  onChange(e: ChangeEvent, data: InputOnChangeData) {
    const { dispatch } = this.props
    switch (data.name) {
      case 'refresh':
        dispatch(settingActions.setRefresh(parseInt(data.value) * 1000))
        break
      case 'timeRange':
          dispatch(settingActions.setTimeRange(parseInt(data.value) * 1000 * 60))
        break
    }
  }

  speedFunction(data: Array<any>) {
    return data.map((item: any) => {
      return {
        ...item,
        name: moment(item.time * 1000).format('mm:ss')
      }
    })
  }

  odoFunction(data: Array<any>) {
    return data.map((item: any) => {
      return {
        ...item,
        name: moment(item.time * 1000).format('mm:ss')
      }
    })
  }

  tempFunction(data: Array<any>) {
    return data.map((item: any) => {
      return {
        ...item,
        name: moment(item.time * 1000).format('mm:ss')
      }
    })
  }

  render() {
    const { timeRange, refresh, speed, temp, odo } = this.props

    const speedData = this.speedFunction(speed)
    const ododData = this.odoFunction(odo)
    const tempdData = this.tempFunction(temp)

    return (
      <Page title='Main'>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              name='timeRange'
              onChange={this.onChange.bind(this)}
              defaultValue={timeRange / 60000}
              label='Data for the past (in minutes)'
              type='number'
              min='1'
              max='10' />
            <Form.Input
              fluid
              name='refresh'
              onChange={this.onChange.bind(this)}
              defaultValue={refresh / 1000}
              label='Auto refresh (in seconds)'
              type='number'
              min='1'
              max='60' />
          </Form.Group>
        </Form>

        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment>
                <DataChart title='Speed' data={speedData} />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment>
                <DataChart title='Odometer' data={ododData} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment>
                <DataChart title='Temperature' data={tempdData} />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment>
                <DataChart title='HTTP Latency' data={[]} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </Page>
    )
  }
}

function mapStateToProps(state: AppState) {
  const { settings, data } = state
  return {
    timeRange: settings.timeRange,
    refresh: settings.refresh,
    speed: data.speed,
    odo: data.odo,
    temp: data.temp,
  }
}

export default connect(mapStateToProps)(HomePage)
