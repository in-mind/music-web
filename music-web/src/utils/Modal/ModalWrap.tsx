import classNames from 'classnames';
import React, { useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import styles from './modalWrap.module.scss';


function ModalWrap(props:any) {

  const {children} = props;
  const node = document.createElement('div');
  node.className = classNames(styles.modal)

  useEffect(() => {
    document.body.appendChild(node);
    return () => {
      console.log(12345)
      document.body.removeChild(node)
    }
  }, [])
  return (
    ReactDOM.createPortal(
     children,
     node
    )
  )
}

export default ModalWrap