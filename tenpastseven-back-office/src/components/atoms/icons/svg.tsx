"use client";

import React from "react";
import { SvgList } from "@shared/types";

import Logo from "@/assets/icons/logo.svg";
import LogOut from "@/assets/icons/log-out.svg";
import AnglesLeft from "@/assets/icons/angles-left.svg";
import AnglesRight from "@/assets/icons/angles-right.svg";
import ChevronRight from "@/assets/icons/chevron-right.svg";
import ProductPage from "@/assets/icons/product-page.svg";
import MemberPage from "@/assets/icons/member-page.svg";
import XMark from "@/assets/icons/x-mark.svg";
import Plus from "@/assets/icons/plus.svg";
import Search from "@/assets/icons/search.svg";

interface Props extends React.SVGProps<SVGSVGElement> {
  name: SvgList;
}

export default React.memo(function Svg(props: Props) {
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
    case "plus": {
      return <Plus {...filterProps} />;
    }
    case "search": {
      return <Search {...filterProps} />;
    }

    default: {
      return <div>존재하지 않는 SVG입니다. name을 확인해주세요</div>;
    }
  }
});
