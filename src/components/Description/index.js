import React, { Component } from 'react';
import { BASE_URL } from 'services/config';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './style.css';

const localeCreate = window.locale.Create;

export default class Description extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const urlUpload = BASE_URL + '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json';
        return (
            <div className="col-xs-12">
                <div className="describe">
                    <div className="form-group">
                        <CKEditor
                            name="description"
                            editor={ ClassicEditor }
                            config={{
                                ckfinder: {
                                    uploadUrl: urlUpload
                                },
                                placeholder: localeCreate.message_holder_enter_description
                            }}
                            content={this.props.data}
                            value={this.props.data}
                            data={this.props.data || ''}
                            onChange={ ( event, editor ) => {
                                this.props.onChange(editor.getData())
                            } }
                        />
                        {
                            !this.props.isValidDescription ?
                                <span className="placeholder-error">
                                    {localeCreate.REQUIRED_DESCRIPTION_MSG}
                                </span> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}