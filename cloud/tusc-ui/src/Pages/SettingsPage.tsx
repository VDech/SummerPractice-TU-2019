import React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Page, } from '../_components/Page'
import { AppState } from '../_reducers';
import { Table, Form } from 'semantic-ui-react';
import { settingActions } from '../_actions/setting.actions';

type Props = DispatchProp & {
  speedUrl: string,
  odoUrl: string,
  tempUrl: string,
}

class SettingsPage extends React.PureComponent<Props> {

  onBlur(e:any) {
    if (e.target && e.target.name) {
      switch (e.target.name) {
        case 'speedUrl':
          this.props.dispatch(settingActions.setSpeedUrl(e.target.value))
          break
        case 'odoUrl':
          this.props.dispatch(settingActions.setOdoUrl(e.target.value))
          break
        case 'tempUrl':
          this.props.dispatch(settingActions.setTempUrl(e.target.value))
          break
      }
    }
  }

  render() {
    return (
      <Page title='Settings'>

        <Form>
          <Table celled columns={2}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Setting</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Form.Field>
                    <label>Speed URL</label>
                    <Form.Input
                      defaultValue={this.props.speedUrl}
                      onBlur={this.onBlur.bind(this)}
                      name='speedUrl'
                      placeholder='Speed URL' />
                  </Form.Field>
                </Table.Cell>
                <Table.Cell>URL for speed data.</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Form.Field>
                    <label>ODO URL</label>
                    <Form.Input
                      defaultValue={this.props.odoUrl}
                      onBlur={this.onBlur.bind(this)}
                      name='odoUrl'
                      placeholder='ODO URL' />
                  </Form.Field>
                </Table.Cell>
                <Table.Cell>URL for ODO data.</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Form.Field>
                    <label>Temperature URL</label>
                    <Form.Input
                      defaultValue={this.props.tempUrl}
                      onBlur={this.onBlur.bind(this)}
                      name='tempUrl'
                      placeholder='Temperature URL' />
                  </Form.Field>
                </Table.Cell>
                <Table.Cell>URL for temperature data.</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

        </Form>

      </Page>
    )
  }
}

function mapStateToProps(state: AppState) {
  const { settings } = state
  return {
    speedUrl: settings.speedUrl,
    odoUrl: settings.odoUrl,
    tempUrl: settings.tempUrl,
  }
}

export default connect(mapStateToProps)(SettingsPage)
