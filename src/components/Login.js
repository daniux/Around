import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message } from 'antd';
import { API_ROOT } from '../constants';
// Login Token:
// username: qqqq; pasword: qqqq
/// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDUwODgyMzIsInVzZXJuYW1lIjoicXFxcSJ9.U96IK8d_rX6MK7KjQKzA_Lg7POyJt83ZijyOpDOOVmA
  

  const FormItem = Form.Item;
  
  class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
            fetch(`${API_ROOT}/login`, {
                method: 'POST',
                body: JSON.stringify({
                  username: values.username,
                  password: values.password,
                }),
            }).then((response) => {
                if (response.ok) {
                  return response.text();
                }
                throw new Error(response.statusText);
            }).then((response) => {
                message.success('Login Succeed');
                // TODO: Handle login state change
                // this.props.history.push('/login');
                 this.props.handleLogin(response);
            }).catch((e) => {
                message.error('Login Failed');
                console.log(e);
            })
          }
      });
    }
  
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to="/register">register now!</Link >
          </FormItem>
        </Form>
      );
    }
  }
  
  export const Login = Form.create()(NormalLoginForm);