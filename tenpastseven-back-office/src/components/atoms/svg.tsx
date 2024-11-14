"use client";

import { SvgList } from "@shared/types";

import Logo from "@/assets/svg/logo.svg";
import LogOut from "@/assets/svg/log-out.svg";
import AnglesLeft from "@/assets/svg/angles-left.svg";
import AnglesRight from "@/assets/svg/angles-right.svg";
import ChevronRight from "@/assets/svg/chevron-right.svg";
import ProductPage from "@/assets/svg/product-page.svg";
import MemberPage from "@/assets/svg/member-page.svg";
import XMark from "@/assets/svg/x-mark.svg";

interface Props extends React.SVGProps<SVGSVGElement> {
  name: SvgList;
}

export default function Svg(props: Props) {
  const { name, ...filterProps } = props;

  switch (name) {
    case "logo": {
      return <Logo {...filterProps} />;
    }
    case "log-out": {
      return <LogOut {...filterProps} />;
    }
    case "angles-left": {
      return <AnglesLeft {...filterProps} />;
    }
    case "angles-right": {
      return <AnglesRight {...filterProps} />;
    }
    case "chevron-right": {
      return <ChevronRight {...filterProps} />;
    }
    case "product-page": {
      return <ProductPage {...filterProps} />;
    }
    case "member-page": {
      return <MemberPage {...filterProps} />;
    }
    case "x-mark": {
      return <XMark {...filterProps} />;
    }

    default: {
      return <div>존재하지 않는 SVG입니다. name을 확인해주세요</div>;
    }
  }
}
