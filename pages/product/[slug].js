import React,{useState} from 'react'
import {client, urlFor} from '../../lib/client'
import Product from '../../components/Product'
import { useStateContext } from '../../context/StateContext'
import getStripe from '../../lib/getStripe'
import toast from 'react-hot-toast'

import {AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar} from 'react-icons/ai'


const ProductDetails = ({currentProductData, simillarProductdata}) => {
    const {image, name, details, price} = currentProductData
    const [index, setIndex] = useState(0)
    const {decQty, incQty, qty, onAdd}  = useStateContext()

    const handlePurchase = async () => {
        currentProductData.quantity = qty
        const stripe = await getStripe()

        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify([currentProductData])
        })

        if (response.statusCode === 500) return

        const data = await response.json()

        toast.loading('Redirecting to payments page...')

        stripe.redirectToCheckout({ sessionId: data.id });
    }
  return (
    <div>
        <div className="product-detail-container">
            <div>
                <div className="image-container">
                    <img src={urlFor(image && image[index])} className="product-detail-image"/>
                </div>
                <div className="small-images-container">
                    {image?.map((item, i) => (
                        <img
                            key={item._id}
                            src={urlFor(item)}
                            className={i === index ? 'small-image selected-image' : 'small-image'}
                            onMouseEnter = {() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>
            <div className="product-detail-desc">
                <h1> {name} </h1>
                <div className="reviews">
                   <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                   </div>
                    <p>
                        (20)
                    </p>
                </div>
                <h4> Details: </h4>
                <p> {details} </p>
                <p className="price"> ${price} </p>
                <div className="quantity">
                    <h3> Quantity: </h3>
                    <p className="quantity-desc">
                        <span className="minus" onClick={decQty}>
                            <AiOutlineMinus />
                        </span>
                        <span className="num">
                            {qty}
                        </span>
                        <span className="plus" onClick={incQty}>
                            <AiOutlinePlus />
                        </span>
                    </p>
                </div>
                <div className="buttons">
                    <button type="button" className="add-to-cart" onClick={() => onAdd(currentProductData, qty)}>
                        Add To Cart
                    </button>
                    <button type="button" className="buy-now" onClick={handlePurchase}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
        <div className="maylike-products-wrapper">
                <h2> You may also like </h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {simillarProductdata.map((item) => ((
                            <Product key={item._id} product={item}/>
                        )))}
                    </div>
                </div>
        </div>
    </div>
  )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "current"]{
        slug{
            current
        }
    }`

    const products = await client.fetch(query)

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async({params: {slug}}) => {
    const currentProductQuery = `*[_type == "product" && slug.current == '${slug}'][0]`
    const currentProductData = await client.fetch(currentProductQuery)

    const simillarProductsQuery = '*[_type == "product"]'
    const simillarProductdata = await client.fetch(simillarProductsQuery)

    return {
        props: {
            currentProductData, simillarProductdata
        }
    }
}

export default ProductDetails