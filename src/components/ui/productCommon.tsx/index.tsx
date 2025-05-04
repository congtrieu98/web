/* eslint-disable @next/next/no-img-element */
'use client'

// export interface productsCommonProps {
//     product: {
//         id: number;
//     img: string;
//     title: string;
//     price: string;
//     oldPrice: string;
//     discount: string;
//     description: string;
//     label: string;
//     }
// }

export const ProductCommon = ({ products = [] }: { products: any[] }) => {
    return (
        <>
            {products?.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="relative">
                        <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                        {/* {product.label && <ProductLabel text={product.label} />} */}
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.label}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-left text-gray-800">{product.title}</h3>
                        <div className="mt-2 flex flex-col gap-2 items-left justify-start">
                            <div className="flex gap-1 text-left justify-start">
                                <span className="text-gray-400 line-through text-sm ">{product.oldPrice}</span>
                                <span className="text-green-500 text-sm">{product.discount}</span>
                            </div>
                            <span className="flex text-[#BF1F2C] text-xl leading-5 font-extrabold justify-start">{product.price}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 text-left">{product.description}</p>
                    </div>
                </div>
            ))}
        </>
    )
}

// const ProductLabel = ({ text }: { text: string }) => {
//     return (
//         <div className="absolute top-2 left-0 bg-gradient-to-b from-blue-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center w-20 h-10 ">
//             {text}
//         </div>
//     );
// };