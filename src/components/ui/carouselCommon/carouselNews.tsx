/* eslint-disable @next/next/no-img-element */
'use client'


import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const newsItems = [
    {
        id: 1,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 2,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 3,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 4,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 5,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 6,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024 66",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 7,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024 77",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
    {
        id: 8,
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024 88",
        src: "/assets/news/news.png",
        alt: "PC Gaming 2024",
    },
];

const CarouselNews = () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 8000, min: 3000 },
            items: 5,

        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,

        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,

        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,

        }
    };
    return (
        <Carousel
            responsive={responsive}
            // autoPlay={true}
            rewind={true}
            rewindWithAnimation={true}
            className="flex gap-3"
        >
            {newsItems.map((item) => (
                <div className="flex flex-col border rounded-2xl hover:shadow-lg mr-4" key={item?.id}>
                    <Link href={`/news/${item.id}`}><img src={item.src} alt={item.alt} className="rounded-2xl cursor-pointer" /></Link>

                    <div className="px-2 ">
                        <div className="text-center text-xl uppercase font-medium pt-2
                     mb-2 leading-7 seafood_truncate-2">
                            {item.title}
                        </div>
                        <div className="text-center seafood_truncate-3">
                            Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Unde et porro nostrum facilis
                            consectetur molestiae corporis, aliquid
                            earum fugiat molestias soluta necessitatibus
                            sapiente iusto ea in eius sed
                        </div>
                        <Link href={`/news/${item.id}`} className="flex justify-center py-5">
                            <div className="text-center bg-blue-500 text-white py-1.5 px-4 rounded-full transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105 duration-300 cursor-pointer">Chi tiết</div>
                        </Link>
                    </div>
                </div>
            ))}
        </Carousel>
    )
}

export default CarouselNews