import React from 'react';
import Layout from 'components/Layout';

const locale404 = window.locale['404']

const Page404 = () => (
  <Layout
    index={-1}
    mainContent={() => (
      <div>
        <div className="box-404 box">
          <div className="inner">
            <h2> { locale404.HEADING } </h2>
            <div className="caption text-center">
              <p>{ locale404.TITLE_1 }</p>
              <p>{ locale404.TITLE_2 }</p>
            </div>
          </div>
        </div>
      </div>
    )}
  />
);

export default Page404;
