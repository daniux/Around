import React from 'react';
import {
    Form, Select, Upload, Icon, Input
  } from 'antd';
  
  const { Option } = Select;
  
  class NormalCreatePostForm extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }
  
    normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  
    beforeUpload = () => false;

    render() {
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label="Message"
          >
            {getFieldDecorator('message', {
              rules: [{ required: true, message: 'Please input your message!' }],
            })(
              <Input placeholder="Please input your message"/>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Image"
          >
            <div className="dropbox">
              {getFieldDecorator('Image', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ required: true, message: 'PLease select an image'}]
              })(
                <Upload.Dragger name="files" beforeUpload={this.beforeUpload}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>
              )}
            </div>
          </Form.Item>
        </Form>
      );
    }
  }
  
  export const CreatePostForm = Form.create()(NormalCreatePostForm);