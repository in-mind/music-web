import React, { useEffect, useRef, useState } from 'react';
import styles from './shellHeader.module.scss';
import logo from '../../../public/logo.png';
import classNames from 'classnames';
import { useHistory, withRouter } from 'react-router-dom';
import { FetchData } from '../../utils/service';
import platForm from '../../../public/platform.png';
import './modal.scss';
import { Dialog, DialogTitle, Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import md5 from 'js-md5';

interface IMenu {
  item: string,
  path: string
}

const MENU: IMenu[] = [
  { item: '发现音乐', path: '/' },
  { item: '我的音乐', path: '/my' }
];

const suggestMap: any = {
  songs: ['单曲', 'fa-music'],
  artists: ['歌手', 'fa-user-o'],
  albums: ['专辑', 'fa-dot-circle-o'],
  playlists: ['歌单', 'fa-assistive-listening-systems'],
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

function ShellHeader() {

  const history = useHistory();
  const [selectedIndex, setselectedIndex] = useState(0);
  const [dropDownExpand, setDropDownExpand] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestSearchData, setSuggestSearchData] = useState<any>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPhoneLoginModal, setShowPhoneLoginModal] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [pwdValue, setPwdValue] = useState('');
  const [officialTermsChecked, setOfficialTermsChecked] = useState(false);

  const searchChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
    if (searchValue) {
      const res: any = await FetchData(`http://localhost:3000/search/suggest?keywords=${searchValue}`, 'GET');
      setSuggestSearchData(res.result);
      setDropDownExpand(true);
    } else {
      setDropDownExpand(false);
    }

  }

  const selectMenuItem = function (key: number, path: string): void {
    setselectedIndex(key);
    history.push(path)
  }

  const onConfirm = function () {
    setShowLoginModal(false);
  }

  const onCancel = function () {
    setShowLoginModal(false);
  }

  const goToSuggestDetailPage = function (e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
    console.log('goto detail page');
  }

  const handleSearchInputFocus = function (e: React.FocusEvent<HTMLInputElement>) {
    function handleClick(e: React.FocusEvent<HTMLInputElement>) {
      console.log('body')
      e.stopPropagation();
      setDropDownExpand(false);
      document.body.removeEventListener('click', bindClick);
    }
    const bindClick = handleClick.bind(null, e);
    document.body.addEventListener('click', bindClick);
    searchValue && setDropDownExpand(true)
  }

  const login = async function () {
    if(phoneValue && pwdValue) {
      const md5PwdValue = md5(pwdValue);
      console.log(md5PwdValue)
      const res: any = await FetchData(`http://localhost:3000/login/cellphone?phone=${phoneValue}&md5_password=${md5PwdValue}`, 'GET');
      console.log(res)
    }
  }

  return (
    <div className={styles.headerTop}>
      <div className={styles.headerWrap}>
        <div>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.headerText}>
          网易云音乐
        </div>
        <div className={styles.headerMenu}>
          {
            MENU.map((ele, key) =>
            (<div key={key}
              className={classNames(styles.headerMenuItem, { [styles.headerMenuItemSelected]: key === selectedIndex })}
              onClick={() => { selectMenuItem(key, ele.path) }}
            >
              {ele.item}
              <div className={classNames({ [styles.selectedTri]: key === selectedIndex })}></div>
            </div>)
            )
          }
        </div>

        <div className={styles.headerSearch}>
          <label htmlFor="searchInput"></label>
          <input id="searchInput" type="text"
            className={styles.headerInput}
            placeholder="音乐/视频/电台/用户"
            onChange={(e) => { searchChange(e) }}
            onFocus={(e) => { handleSearchInputFocus(e) }}
            onClick={(e) => { e.stopPropagation(); }}
          />
          {
            dropDownExpand &&
            <div className={styles.dropDownWrap}>
              <div className={styles.dropDownContentHeader}>
                搜"{searchValue}"相关用户&gt;
              </div>
              <div className={styles.dropDownContentWrap}>
                {
                  suggestSearchData.order && suggestSearchData.order.map((ele: any, key: number) => (
                    <div className={styles.dropDownContent} key={key}>
                      <div className={styles.dropDownContentLeft}>
                        <i className={`fa ${suggestMap[ele][1]}`}></i> &nbsp;
                        {suggestMap[ele][0]}
                      </div>
                      <ul className={classNames(styles.dropDownContentRight, { [styles.dropDownContentRightTop]: key === 0 })}>
                        {
                          suggestSearchData[ele].map((item: any, key: number) => (
                            <li onClick={(e) => { goToSuggestDetailPage(e) }} key={key}>
                              {item.name}
                            </li>
                          ))
                        }
                      </ul>

                    </div>

                  ))
                }

              </div>

            </div>
          }
        </div>

        <div className={styles.loginText} onClick={() => { setShowLoginModal(true) }}>登录 </div>

        <Dialog
          open={showLoginModal}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" disableTypography={false}>
            <div>登录</div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>
                <img src={platForm} alt="platform" />
                <button className="btn login-btn" onClick={() => { officialTermsChecked && setShowPhoneLoginModal(true) }}> 手机号登录</button>
                <button className="btn register-btn">注&nbsp;册</button>
                <div className="treatyStyle">
                  <input type="checkbox" checked={officialTermsChecked} onChange={() => { setOfficialTermsChecked(!officialTermsChecked) }} />
                  同意
                  <a href="https://st.music.163.com/official-terms/service">《服务条款》</a>
                  <a href="https://st.music.163.com/official-terms/privacy">《隐私政策》</a>
                  <a href="https://st.music.163.com/official-terms/children">《儿童隐私政策》</a>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowLoginModal(false) }}>
              cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showPhoneLoginModal}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" disableTypography={false}>
            <div>手机号登录</div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="modal-content-phone">
                <div className="phone-input-wrap">
                  <label htmlFor="PhoneInput"></label>
                  <input id="PhoneInput" className="phone-input" type="text" placeholder="请输入手机号"  onChange={(e) => { setPhoneValue(e.target.value) }} />
                </div>
                <div className="pwd-input-wrap">
                  <label htmlFor="PwdInput"></label>
                  <input id="PwdInput" className="pwd-input" type="password" placeholder="请输入密码" onChange={(e) => { setPwdValue(e.target.value) }} />
                </div>
                <div className="pwd-text"><div>自动登录</div> <div>忘记密码</div></div>
                <button className="btn login-btn" onClick={() => { login() }}>登&nbsp;录</button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>



        {/* <Modal
          visible={false}
          onConfirm={onConfirm}
          onCancle={onCancel}
          title={loginTitle}
        >
          <div className="modal-content">
            <img src={platForm} alt="platform" />
            <button className="btn login-btn" onClick={() => goToPhoneLoginModal()}> 手机号登录</button>
            <button className="btn register-btn">注&nbsp;册</button>
            <div className="treatyStyle">
              <input type="checkbox" ref={treatyCheckedEl} />
              同意
              <a href="https://st.music.163.com/official-terms/service">《服务条款》</a>
              <a href="https://st.music.163.com/official-terms/privacy">《隐私政策》</a>
              <a href="https://st.music.163.com/official-terms/children">《儿童隐私政策》</a>
            </div>
          </div>
        </Modal> */}
        {/* <Modal
          visible={false}
          onConfirm={onConfirm}
          onCancle={onCancel}
          title="手机号登录"
        >
          <div className="modal-content-phone">
            <div className="phone-input-wrap">
              <label htmlFor="PhoneInput"></label>
              <input id="PhoneInput" className="phone-input" type="text" placeholder="请输入手机号" ref={inputPhoneEl} onChange={(e) => {setPhoneValue(e.target.value)}} />
            </div>
            <div className="pwd-input-wrap">
              <label htmlFor="PwdInput"></label>
              <input id="PwdInput" className="pwd-input" type="password" placeholder="请输入密码" ref={inputPwdEl} onChange={(e) => {setPwdValue(e.target.value)}} />
            </div>
            <div className="pwd-text"><div>自动登录</div> <div>忘记密码</div></div>
            <button className="btn login-btn" onClick={() => {login()}}>登&nbsp;录</button>

          </div>
        </Modal> */}
      </div>
    </div>
  )

}

export default ShellHeader;