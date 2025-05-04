/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Carousel } from "react-responsive-carousel";

const ProductDetail = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div>

          <Carousel showArrows={true}>
            <div>
              <img src="https://product.hstatic.net/1000182631/product/img_3089_62f216fb3eef451ba4d96038b71a7d70_master.jpg" />
            </div>
            <div>
              <img src="https://product.hstatic.net/1000182631/product/z5283249145272_e2dedfa5565fa3f51f52969a445ed089_2fdc3af97dd94e12a2559abcb126d061_master.jpg" />
            </div>
            <div>
              <img src="https://product.hstatic.net/1000182631/product/z5283249145421_39cf43ef86cf35dc335732885c17cdcf_5da01a3c043649af97b5eda216a8d084_master.jpg" />
            </div>
            <div>
              <img src="https://product.hstatic.net/1000182631/product/seeding_ghe_5_3ad93dffa96e4c5cb54360d11db98428_master.jpeg" />
            </div>
            <div>
              <img src="https://product.hstatic.net/1000182631/product/thitghexanhhap_f3adb1f909a54db8b3e1530ea0e01b3a_master.jpg" />
            </div>

          </Carousel>



          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>👍</span> Cam kết giá tốt nhất thị trường
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🔄</span> Lỗi 1 đổi 1 ngay lập tức
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>✔️</span> Sản phẩm mới 100%
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>💳</span> Hỗ trợ trả góp - Thủ tục nhanh gọn
            </div>
          </div>
        </div>


        <div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Ổ Cứng HDD ASUS A561
          </h1>


          <div className="flex gap-2 mb-4 items-center border rounded-lg p-4 bg-white shadow-sm">
            <p className="text-[#BF1F2C] text-2xl leading-5 font-extrabold">37.940.000đ</p>
            <p className="text-lg text-gray-400 line-through font-medium">40.940.000đ</p>
            <p className="text-sm text-red-600 font-semibold">
              Tiết kiệm 3.000.000đ
            </p>
          </div>


          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Thông số sản phẩm
            </h2>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              <li>
                Tụ điện và cuộn cảm vượt qua các bài kiểm tra thử nghiệm khắt khe để đạt được chứng nhận
                độ bền chuẩn quân sự.
              </li>
              <li>
                Tụ trục kép có độ bền gấp đôi so với thiết kế tụ trục tự thông thường.
              </li>
              <li>
                Một lớp phủ PCB bảo vệ bảng mạch khỏi độ ẩm cao, bụi bẩn và nhiệt độ cao.
              </li>
              <li>
                Mạch chống nhiễm 80 Plus Gold đạt được mức độ hiệu quả cao của điện Nhật Bản cũng các
                thành phần linh kiện cao cấp khác.
              </li>
            </ul>
            <a href="#" className="text-blue-500 hover:underline text-sm">
              Xem thêm
            </a>
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