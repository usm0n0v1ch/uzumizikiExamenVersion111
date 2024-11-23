import Basket from '../../UI/Basket'
import ContactHeader from '../contactHeader'

import Logo from '../Logo'
import RegAndAuth from '../RegAndAuth'
import styles from './style.module.css'
import { Link } from 'react-router-dom';



export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
      
        <Logo />
      </div>
      <div className={styles.contactHeader}>
        <ContactHeader/>
      </div>
      <div className={styles.regAndAuth}>
        <RegAndAuth/>
      </div>
      <div className={styles.basket}>
        <Basket/>
      </div>
      <div>
        <Link className={styles.profile} to="/profile">
          Профиль

        </Link>
        
      </div>
    </div>
  )
}