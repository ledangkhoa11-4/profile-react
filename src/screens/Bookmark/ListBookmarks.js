import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import Bookmark from './Item';

const ListBookmarks = (props) => {
  return(
    <div className="box-main" id="box-main">
        {
          props.bookmarks.length > 0 || props.bookmarks === null ? 
           map(props.bookmarks, (item, idx) => <Bookmark
             key={idx}
             {...item}
             removeBookmark={props.removeBookmark}
             localeArticle={props.localeArticle}
             localeBookmark={props.localeBookmark}
           />)
           :
           <div className="box-no-bookmark">{props.localeBookmark.NO_BOOKMARK_ARTICLE}</div>
         }
    </div>
  );
}

ListBookmarks.propTypes = {
  bookmarks: PropTypes.array.isRequired,
}

export default ListBookmarks;
