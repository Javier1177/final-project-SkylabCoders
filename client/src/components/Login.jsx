import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import swal from 'sweetalert2'

class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = e => {
        const {name, value} = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = e => {
        e.preventDefault()

        const {email, password} = this.state
        logic.login(email, password)
            .then(res => {
                this.props.handleLogin(res.id, res.token)
            })
            .catch(({message}) =>  swal({
                title: "Failed!",
                text: message,
                type: "error",
                confirmButtonText: "Try again"
              }))
    }

    //TODO handle error Wrong password/email
    render() {
        return <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input type="text" name="email" onChange={this.handleChange} name="email" />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" name="password" onChange={this.handleChange} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    }
}

export default withRouter(Login)