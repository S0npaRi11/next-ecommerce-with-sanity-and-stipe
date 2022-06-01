import Stripe from 'stripe'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req,res) {

    // console.log(req.body)
    if(req.method === 'POST'){
        try {
            const params = {
                line_items:req.body.map((item) => {
                    const img = item.image[0].asset._ref
                    const newImg = img.replace('image-', `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_PROJECT_ID}/production/`).replace('-webp', '.webp')

                    return {
                        price_data:{
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImg],
                            },
                            unit_amount: item.price * 100
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1
                        },
                        quantity: item.quantity

                    }
                }),
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {shipping_rate: 'shr_1L4nBMSHK7VrrVa3gRK4msIv'},
                    { shipping_rate: 'shr_1L4mCgSHK7VrrVa3sYpd4HkC' }
                ],
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/?canceled=true`
            }

            const session = await stripe.checkout.sessions.create(params)

            // res.redirect(303, session.url)
            res.status(200).json(session)
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: error.message
            })
        }
    }else{
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}