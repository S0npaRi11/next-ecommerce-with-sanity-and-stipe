import React from 'react'
import { Product, FooterBanner, HeroBanner } from '../components'
import {client} from '../lib/client'

const Home = ({productdata, bannerData}) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

      <div className="products-heading">
        <h2> Best Selling Products </h2>
        <p> Speakers of many variations </p>
      </div>

      <div className="products-container">
        {productdata.map((product) => 
          <Product  key={product._id} product={product}/>)}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>
    </>
  )
}

export const getServerSideProps = async () => {
  const productQuery = '*[_type == "product"]'
  const productdata = await client.fetch(productQuery)

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  return {
    props: {productdata, bannerData}
  }
}

export default Home