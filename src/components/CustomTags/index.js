import React from 'react';
import AutosizeInput from 'react-input-autosize';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

const CustomTags = (props) => <TagsInput
  renderInput={({addTag, ...props}) => {
    
    const {onChange, value, ...other} = props
    return (
      <AutosizeInput type='text' onChange={onChange} value={value} {...other} />
    )
  }}
  {...props}
  addOnPaste={true}
  pasteSplit= {(data) => {
    const separators = [' ', ',', ';', ':', '\n', '\r'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  }}
/>

export default CustomTags;
