/* eslint-disable no-invalid-this */
import React, { Component } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { useRouter } from 'next/router'
import { withRouter } from 'next/router'

class CampaignNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minimumContribution: '',
      errorMessage: '',
      loading: false,
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    this.setState({ loading: true, errorMessage: '' })

    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        })

      this.setState({ loading: false })
      // const router = useRouter()
      // router.push(`/`)
      this.props.router.push(`/`)
    } catch (err) {
      this.setState({ errorMessage: err.message, loading: false })
    }
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label='wei'
              labelPosition='right'
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    )
  }
}

export default withRouter(CampaignNew)
// CampaignNew(withRouter)
