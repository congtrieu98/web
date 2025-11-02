/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// import { cn } from "@/lib/utils";
import { Product } from "@/types/main";
import { BadgePlus, FileText, Gift, RefreshCcw, ThumbsUp } from "lucide-react";
import React from "react";
import { Carousel } from "react-responsive-carousel";

const ProductDetail = ({ product }: { product: Product }) => {
  console.log('product', product);

  // const toggleExpand = () => {
  //   setIsExpanded(!isExpanded);
  // };
  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carousel image */}
        <div>
          <Carousel showArrows={true} emulateTouch={true} showStatus={false} dynamicHeight={true}>
            {product.media.map((media, index) => (
              <div key={index}>
                <img
                  src={media}
                  className="object-contain mx-auto bg-white rounded-lg"
                  alt="Ảnh sản phẩm"
                />
              </div>
            ))}
          </Carousel>



          <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-4 mt-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ThumbsUp size={24} className="text-[#0F5B99]" />
                <span className="text-sm font-semibold text-[#0F5B99]">Cam kết giá tốt nhất thị trường</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <BadgePlus size={24} className="text-[#0F5B99]" />
                <span className="text-sm font-semibold text-[#0F5B99]">Sản phẩm mới 100%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <RefreshCcw size={24} className="text-[#0F5B99]" />
                <span className="text-sm font-semibold text-[#0F5B99]">Lỗi 1 đổi 1 ngay lập tức</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FileText size={24} className="text-[#0F5B99]" />
                <span className="text-sm font-semibold text-[#0F5B99]">Hỗ trợ trả góp - Thủ tục nhanh gọn</span>
              </div>

            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {product.productName}
          </h1>


          <div className="flex gap-2 mb-4 items-center border rounded-2xl p-4 bg-white shadow-sm">
            <p className="text-[#BF1F2C] text-2xl leading-5 font-extrabold">{product.price}đ</p>
            <p className="text-lg text-gray-400 line-through font-medium">{product.oldPrice && product.oldPrice}đ</p>
            <p className="text-sm text-red-600 font-semibold">
              Tiết kiệm {product.oldPrice && product.oldPrice - product.price}đ
            </p>
          </div>


          {/* Thông số sản phẩm */}
          {/* <div className=" border rounded-2xl  p-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Thông tin sản phẩm
            </h2>
            <div
              className={cn('text-sm text-gray-700 list-disc pl-5 transition-all duration-300 max-h-20 overflow-hidden',
                { "max-h-full": isExpanded }
              )}

            >
              <ul>
                <li>
                  {product.description}
                </li>
                <li>
                  Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                  thành phần linh kiện cao cấp khác.
                </li>
                <li>
                  Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                  thành phần linh kiện cao cấp khác.
                </li>
                <li>
                  Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                  thành phần linh kiện cao cấp khác.
                </li>
                <li>
                  Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                  thành phần linh kiện cao cấp khác.
                </li>
                <li>
                  Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                  thành phần linh kiện cao cấp khác.
                </li>
              </ul>
            </div>

            <button
              onClick={toggleExpand}
              className="text-blue-500  text-sm mt-2"
            >
              <div className="flex gap-1 items-center">
                {isExpanded ? "Thu gọn" : "Xem thêm"} <ChevronDown size={16} className="inline" />
              </div>
            </button>
          </div> */}

          {/* Quà tặng */}
          <div className="flex flex-col gap-2 mb-4 items-center rounded-lg bg-white shadow-sm" style={{ border: '1px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0F5B99, #E4A835)', backgroundOrigin: 'border-box', backgroundClip: 'content-box, border-box' }}>
            <div className="flex gap-2 bg-gradient-to-r from-[#0F5B99] to-[#E4A835] py-2 px-4 w-full rounded-t-lg">
              <Gift size={24} className="inline text-white" />
              <span className="text-white font-semibold">Quà tặng</span>
            </div>
            <div className="p-4">
              <ul>
                <li>
                  Mua thêm màn hình đang được khuyến mại ( Giảm thêm 100K khi mua kèm PC )
                </li>
                <li>
                  Mua thêm Gear ( Phím, Chuột, tai nghe, ghế ) đang được khuyến mại
                </li>
                <li>
                  Miễn phí giao hàng toàn quốc.
                </li>
                <li>
                  Hỗ trợ trả góp online toàn quốc - linh hoạt
                </li>

                <li>
                  Bảo hành đổi mới trong thời gian đầu sử dụng - nhanh gọn.
                </li>

              </ul>
            </div>

          </div>


          <div className="flex flex-col gap-4">
            <button className="w-full py-3 bg-gradient-to-r from-[#0F5B99] to-[#E4A835] text-white rounded-md font-semibold text-lg hover:opacity-90">
              ĐẶT MUA NGAY
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button className="w-full py-3 text-white rounded-md font-semibold text-lg bg-[#0F5B99] hover:opacity-90">
                TRẢ GÓP QUA HỒ SƠ
                <span className="block text-sm text-white font-nomal">Chỉ từ 2.665.000đ/tháng</span>
              </button>
              <button className="w-full py-3 text-white rounded-md font-semibold text-lg bg-[#0F5B99] hover:opacity-90">
                TRẢ GÓP QUA THẺ
                <span className="block text-sm text-white font-normal">Chỉ từ 1.332.500đ/tháng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;