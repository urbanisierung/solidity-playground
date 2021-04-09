/* eslint-disable no-invalid-this */
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
// import { useRouter } from 'next/router'

class ContributeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      errorMessage: '',
      loading: false,
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const address = this.props.address
    const campaign = Campaign(address)

    this.setState({ loading: true, errorMessage: '' })

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      })

      // const router = useRouter()
      this.props.router.push(`/campaigns/${this.props.address}`)
      // Router.replaceRoute(`/campaigns/${props.address}`)
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false, value: '' })
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label='ether'
            labelPosition='right'
          />
        </Form.Field>

        <Message error header='Oops!' content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    )
  }
}

export default withRouter(ContributeForm)
