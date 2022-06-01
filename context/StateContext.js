import React, {createContext, useContext, useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct
    let index

    const toggleCart = (state) => {
        setShowCart(state)
    }

    const onAdd = (product,quantity) => {
        const checkInCart = cartItems.find((item) => item._id === product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        if(checkInCart){
            
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return{
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            
            setCartItems(updatedCartItems)
        }else{
            product.quantity = quantity
            setCartItems([...cartItems,{...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const onRemove = (id) => {
        foundProduct = cartItems.find((item) => item._id === id)
        let newCartItems = cartItems.filter((item) => item._id !== id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)        
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)
        if(value === 'inc'){
            let items = [...cartItems]
            items[index].quantity += 1
            setCartItems([...items])
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
        }else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                let items = [...cartItems]
                items[index].quantity -= 1
                setCartItems([...items])
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1

            return prevQty - 1
        })
    }

    return(
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCart,
                toggleCartItemQuantity,
                onRemove,
                setTotalPrice,
                setTotalQuantities,
                setCartItems
            }}
        >
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)