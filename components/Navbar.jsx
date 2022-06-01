import React from 'react'
import Link from 'next/link'
import Cart from './Cart'
import { useStateContext } from '../context/StateContext'

import { AiOutlineShopping } from 'react-icons/ai'

const Navbar = () => {

  const {showCart, totalQuantities, toggleCart} = useStateContext()
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/"> Next E-Commerce </Link>
      </p>

      <button type="button" className="cart-icon" onClick={() => toggleCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      { showCart && <Cart /> }
      {/* { showCart && } */}
    </div>
  )
}

export default Navbar