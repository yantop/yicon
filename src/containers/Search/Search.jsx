import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchSearchData } from '../../actions/search';
import SliderSize from '../../components/SliderSize/SliderSize';
import IconButton from '../../components/common/IconButton/IconButton.jsx';
import { getIconDetail, editIconStyle } from '../../actions/icon';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import { autobind } from 'core-decorators';

import './Search.scss';

@connect(
  state => ({
    list: state.search.data,
    totalCount: state.search.totalCount,
    queryKey: state.search.queryKey,
  }),
  {
    fetchSearchData,
    getIconDetail,
    editIconStyle,
  }
)

export default class Search extends Component {

  state = {
    isShowDownloadDialog: false,
  }

  componentWillMount() {
    this.props.fetchSearchData(this.props.location.query.q);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query.q !== this.props.location.query.q) {
      this.props.fetchSearchData(nextProps.location.query.q);
    }
  }

  @autobind
  clikIconDownloadBtn(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.props.editIconStyle({ color: '#34475e', size: 255 });
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
  }

  @autobind
  dialogUpdateShow(isShow) {
    this.setState({
      isShowDownloadDialog: isShow,
    });
  }

  render() {
    return (
      <div className="yicon-main yicon-search">
        <div className="clearfix yicon-search-info">
          <div className="yicon-search-info-container">
            <div className="clearfix options">
              <div className="search-result">
                共为您找到 <em className="search-result-count">{this.props.totalCount}</em> 个结果
              </div>
              <SliderSize />
            </div>
          </div>
        </div>
        <div className="yicon-search-main">
          {
            this.props.list.map((repo) => (
              <div key={repo.id}>
                <h3 className="clearfix yicon-search-title">
                  {repo.name}图标库
                </h3>
                <div className="clearfix yicon-search-list">
                {
                  repo.icons.map((icon) => (
                    <IconButton
                      icon={icon}
                      repoId={repo.id}
                      key={icon.id}
                      download={this.clikIconDownloadBtn(icon.id)}
                      toolBtns={['copytip', 'copy', 'edit', 'download', 'cart']}
                    />
                  ))
                }
                </div>
              </div>
            ))
          }
          {
            <div style={{ display: `${this.props.totalCount > 0 ? 'none' : 'block'}` }}>
              <div className="no-search">
                <div className="no-search-logo"></div>
                <div>
                  <div className="no-search-tips">没有找到任何东西哦</div>
                </div>
              </div>
            </div>
          }
        </div>
        <Dialog
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogUpdateShow}
        >
          <DownloadDialog />
        </Dialog>
      </div>
    );
  }
}

Search.propTypes = {
  fetchSearchData: PropTypes.func,
  location: PropTypes.object,
  queryKey: PropTypes.string,
  getIconDetail: PropTypes.func,
  editIconStyle: PropTypes.func,
  totalCount: PropTypes.number,
  list: PropTypes.array,
};
