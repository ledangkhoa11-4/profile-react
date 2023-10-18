import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import Bookmark from './Item';

const ListBookmarks = (props) => {
  return(
    <div className="box-main" id="box-main">
        {
           map(props.bookmarks, (item, idx) => <Bookmark
             key={idx}
             {...item}
             removeBookmark={props.removeBookmark}
             localeArticle={props.localeArticle}
           />)
         }
    </div>
  );
}

ListBookmarks.propTypes = {
  bookmarks: PropTypes.array.isRequired,
}

export default ListBookmarks;
