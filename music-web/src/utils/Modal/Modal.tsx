import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ModalWrap from './ModalWrap';
import styles from './modal.module.scss';
import classNames from 'classnames';

function Modal(props: any) {

  const { visible, title, children } = props;
  const modalWrapEl = useRef<any>(null);
  let clickClientX: number, clickClientY: number, diffX: number, diffY: number;
  let movable = false;
  const calWindowModalSize = () => ({
    modalWidth: modalWrapEl.current.clientWidth,
    modalHeight: modalWrapEl.current.clientHeight,
    windowWidth: document.body.clientWidth,
    windowHeight: document.body.clientHeight
  })

  function debounce(fn: Function, delay: number) {
    let timer: any = null;
    console.log(1);
    return function (e: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(e);
      }, delay);
    };
  }

  const handleModalMove = function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    console.log(3)
    if (movable) {
      const { clientX, clientY } = e.nativeEvent;
      const { windowWidth, windowHeight, modalWidth, modalHeight } = calWindowModalSize();
      const leftX = clientX - diffX > 0 ? (clientX - diffX > windowWidth - modalWidth ? (windowWidth - modalWidth) : (clientX - diffX)) : 0;
      const topY = clientY - diffY > 0 ? (clientY - diffY > windowHeight - modalHeight ? (windowHeight - modalHeight) : (clientY - diffY)) : 0;
      console.log(clientX, clientY);
      modalWrapEl.current.style.cssText = `left: ${leftX}px; top: ${topY}px;`;
    }
  }



  const handleModalMouseDown = function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    console.log(2);
    movable = true;
    clickClientX = e.nativeEvent.clientX;
    clickClientY = e.nativeEvent.clientY;
    const modalLeft = modalWrapEl.current.offsetLeft;
    const modalTop = modalWrapEl.current.offsetTop;
    diffX = clickClientX - modalLeft;
    diffY = clickClientY - modalTop;
  }

  const handleModalMouseUp = function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    movable = false;
  }


  useEffect(() => {
    if (modalWrapEl.current) {
      const { windowWidth, windowHeight, modalWidth, modalHeight } = calWindowModalSize();
      modalWrapEl.current.style.cssText = `left: ${(windowWidth - modalWidth) / 2}px; top: ${(windowHeight - modalHeight) / 2}px;`;
    }
  }, [visible])


  return (

    visible ? <ModalWrap>
      <div
        className={styles.modalWrap}
        ref={modalWrapEl}
      >
        <div
          className={styles.modalTitle}
          onMouseDown={(e) => { handleModalMouseDown(e) }}
          onMouseMove={(e) => { handleModalMove(e) }}
          onMouseUp={(e) => { handleModalMouseUp(e) }}
        >
          <span className={styles.modalTitleText}>{title}</span>
          <span className={styles.modalTitleBtn} onClick={() => { props.onCancle() }}>
            <i className={classNames('fa fa-times')}></i>
          </span>
        </div>
        <div>{children}</div>
        <div className={styles.modalHandle}>
          <div>
          </div>
        </div>
      </div>



    </ModalWrap> : null

  )


}

export default Modal;