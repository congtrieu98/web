'use client';

import React from 'react';
import Container from '../container';
import Image from 'next/image';
import Link from 'next/link';
import { Headline } from '../../ui/headline';
import { LocationsFooter } from './locations';

export default function Footer() {
  return (
    <footer className="h-full w-full flex flex-col">
      <div className="flex flex-col gap-6 pb-10 md:px-[150px]">
        <Headline text='Hệ thống cửa hàng Dolozisstore' className='px-5' />
        <LocationsFooter />
      </div>
      <Container className="md:bg-[#E5E5E5] bg-[#F8F9FB] p-5">
        <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:px-[150px]'>
          <article className="py-6 px-3 flex flex-row flex-1 gap-3 items-center justify-center bg-[#FFFFFF] rounded-lg">
            <Image
              src="/assets/icons/delivery.svg"
              alt="delivery"
              width={60}
              height={44}
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold leading-5 text-left">
                CHÍNH SÁCH GIAO HÀNG
              </h3>
              <p className="text-[0.81rem] font-semibold leading-5 text-left text-[#646464]">
                Nhận hàng và thanh toán tại nhà
              </p>
            </div>
          </article>
          <article className="py-6 px-3 flex flex-1 flex-row gap-3 items-center justify-center bg-[#FFFFFF] rounded-lg">
            <Image
              src="/assets/icons/exchange.svg"
              alt="exchange"
              width={39}
              height={44}
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold leading-5 text-left">
                ĐỔI TRẢ DỄ DÀNG
              </h3>
              <p className="text-[0.81rem] font-semibold leading-5 text-left text-[#646464]">
                1 Đổi 1 trong 15 ngày
              </p>
            </div>
          </article>
          <article className="py-6 px-3 flex flex-1 flex-row gap-3 items-center justify-center bg-[#FFFFFF] rounded-lg">
            <Image src="/assets/icons/pay.svg" alt="pay" width={45} height={44} />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold leading-5 text-left">
                THANH TOÁN TIỆN LỢI
              </h3>
              <p className="text-[0.81rem] font-semibold leading-5 text-left text-[#646464]">
                Tiền mặt, CK, Trả góp 0%
              </p>
            </div>
          </article>
          <article className="py-6 px-3 flex flex-1 flex-row gap-3 items-center justify-center bg-[#FFFFFF] rounded-lg">
            <Image
              src="/assets/icons/call_service.svg"
              alt="call_service"
              width={51}
              height={44}
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold leading-5 text-left">
                HỖ TRỢ NHIỆT TÌNH
              </h3>
              <p className="text-[0.81rem] font-semibold leading-5 text-left text-[#646464]">
                Tư vấn, giải đáp mọi thắc mắc
              </p>
            </div>
          </article>
        </div>

      </Container>

      {/* DESKTOP */}
      <Container className="w-full h-[500px] md:flex flex-col gap-8 pt-[60px] hidden px-[150px]">
        <nav
          className="flex flex-row justify-between p-5"
          aria-label="Footer Navigation"
        >
          {/* VỀ DOLOZISTORE */}
          <section className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold leading-5 text-left">
              VỀ DOLOZISTORE
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-[0.81rem] font-semibold leading-5 text-left"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/tuyen-dung"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </section>
          {/* CHÍNH SÁCH */}
          <section className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold leading-5 text-left">
              CHÍNH SÁCH
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </section>
          {/* THÔNG TIN */}
          <section className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold leading-5 text-left">
              THÔNG TIN
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Hướng dẫn trả góp
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-[0.81rem] font-semibold leading-5 text-left hover:text-primary"
                >
                  Tra cứu đia chỉ bảo hành
                </Link>
              </li>
            </ul>
          </section>
          {/* TỔNG ĐÀI HỖ TRỢ */}
          <section className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold leading-5 text-left">
              TỔNG ĐÀI HỖ TRỢ
            </h3>
            <address className="flex flex-col gap-3">
              <p className="text-[0.81rem] font-semibold leading-5 text-left">
                Mua hàng: <Link href="tel:19009999">1900.9999</Link>
              </p>
              <p className="text-[0.81rem] font-semibold leading-5 text-left">
                Bảo hành: <Link href="tel:19009999">1900.9999</Link>
              </p>
              <p className="text-[0.81rem] font-semibold leading-5 text-left">
                Khiếu nại: <Link href="tel:19009999">1900.9999</Link>
              </p>
              <p className="text-[0.81rem] font-semibold leading-5 text-left">
                Email:{' '}
                <Link href="mailto:cskh@dolozistore.com">
                  cskh@dolozistore.com
                </Link>
              </p>
            </address>
          </section>
          {/* CÁCH THỨC THANH TOÁN */}
          <section className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold leading-5 text-left">
              CÁCH THỨC THANH TOÁN
            </h3>
            <div className="flex flex-row gap-6 items-center">
              <Image
                src="/assets/icons/visa.svg"
                alt="visa"
                width={94}
                height={44}
              />
              <Image
                src="/assets/icons/mastercard.svg"
                alt="mastercard"
                height={44}
                width={57}
              />
              <Image
                src="/assets/icons/zalo_pay.svg"
                alt="zalo_pay"
                height={44}
                width={44}
              />
              <Image
                src="/assets/icons/momo.svg"
                alt="momo"
                height={44}
                width={44}
              />
            </div>
          </section>
        </nav>
        <hr className="w-full border-t border-black" aria-hidden="true" />
        <section className="flex flex-row gap-6 items-center">
          <h3 className="text-sm font-semibold leading-5 text-left">
            KẾT NỐI VỚI CHÚNG TÔI
          </h3>
          <nav className="flex flex-row gap-4">
            <Image
              src="/assets/icons/facebook.svg"
              alt="facebook"
              height={32}
              width={32}
            />
            <Image
              src="/assets/icons/zalo.svg"
              alt="zalo"
              height={32}
              width={32}
            />
            <Image
              src="/assets/icons/tiktok.svg"
              alt="tiktok"
              height={32}
              width={32}
            />
            <Image
              src="/assets/icons/youtube.svg"
              alt="youtube"
              height={32}
              width={32}
            />
          </nav>
        </section>
      </Container>

      {/* MOBILE */}
      <Container className='md:hidden flex flex-col bg-[#F1F1F1] py-3 gap-4'>
        <div className="flex flex-col gap-4 w-full px-5">
          <div className="flex flex-col gap-2">
            <span className='text-sm font-extrabold text-black uppercase'>Về Dolozistore</span>
            <div className='flex flex-col gap-2'>
              <span className='text-[13px] leading-5 font-semibold text-black'>Giới thiệu</span>
              <span className='text-[13px] leading-5 font-semibold text-black'>Tuyển dụng</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className='text-sm font-extrabold text-black uppercase'>Tổng đài hỗ trợ</span>
            <div className='flex flex-col gap-2'>
              <span className='text-[13px] leading-5 font-semibold text-black'>Mua hàng: 1900.9999</span>
              <span className='text-[13px] leading-5 font-semibold text-black'>Bảo hành: 1900.9999</span>
              <span className='text-[13px] leading-5 font-semibold text-black'>Khiếu nại: 1900.9999</span>
              <span className='text-[13px] leading-5 font-semibold text-black'>Email: cskh@dolozistore.com</span>
            </div>
          </div>
        </div>

        <hr className="w-full border-t border-black" aria-hidden="true" />
        <div className="flex flex-col w-full px-5">
          <section className="flex flex-row gap-6 items-center pt-3">
            <h3 className="text-sm font-semibold leading-5 text-left">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>
            <nav className="flex flex-row gap-4">
              <Image
                src="/assets/icons/facebook.svg"
                alt="facebook"
                height={32}
                width={32}
              />
              <Image
                src="/assets/icons/zalo.svg"
                alt="zalo"
                height={32}
                width={32}
              />
              <Image
                src="/assets/icons/tiktok.svg"
                alt="tiktok"
                height={32}
                width={32}
              />
              <Image
                src="/assets/icons/youtube.svg"
                alt="youtube"
                height={32}
                width={32}
              />
            </nav>
          </section>
        </div>
      </Container>
    </footer>
  );
}
