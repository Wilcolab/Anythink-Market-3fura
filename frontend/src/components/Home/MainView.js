import ItemList from "../ItemList";
import React from "react";
import agent from "../../agent";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";

const YourFeedTab = (props) => {
  if (props.token) {
    const clickHandler = (ev) => {
      ev.preventDefault();
      props.onTabClick("feed", agent.Items.feed, agent.Items.feed());
    };

    return (
      <li className="nav-item">
        <button
          type="button"
          className={props.tab === "feed" ? "nav-link active" : "nav-link"}
          onClick={clickHandler}
        >
          Your Feed
        </button>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = (props) => {
  const clickHandler = (ev) => {
    ev.preventDefault();
    props.onTabClick("all", agent.Items.all, agent.Items.all());
  };
  return (
    <li className="nav-item">
      <button
        type="button"
        className={props.tab === "all" ? "nav-link active" : "nav-link"}
        onClick={clickHandler}
      >
        Global Feed
      </button>
    </li>
  );
};

const TagFilterTab = (props) => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <button type="button" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </button>
    </li>
  );
};

const mapStateToProps = (state) => ({
  ...state.itemList,
  tags: state.home.tags,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
});

const MainView = (props) => {
  //searchTriggered
  if (props.searchTriggered && props.itemsCount === 0) {
    console.log("searchTriggered");
    return (
      <div className="container page">
        <div className="text-center p-4 noResult">
          <div className="mb-1">
            <svg
              height="50px"
              width="50px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                fill="white"
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm0-304c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24v-96c0-13.3-10.7-24-24-24zm0 160c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z"
                />
            </svg>
          </div>
          <span id="empty">
            No items found for "<b>{props.searchTerm}</b>".
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="feed-toggle">
          <ul className="nav nav-tabs">
            <YourFeedTab
              token={props.token}
              tab={props.tab}
              onTabClick={props.onTabClick}
            />

            <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

            <TagFilterTab tag={props.tag} />
          </ul>
        </div>

        <ItemList
          pager={props.pager}
          items={props.items}
          loading={props.loading}
          itemsCount={props.itemsCount}
          currentPage={props.currentPage}
        />
      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
