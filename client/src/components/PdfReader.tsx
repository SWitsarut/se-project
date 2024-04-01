"use client";

import { Button, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfReaderProps {
  pdfUrl: string
}

export default function PdfReader({ pdfUrl }: PdfReaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const [numPages, setNumPages] = useState<number>();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }

  const firstPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${1}`);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const nextPage = () => {
    const params = new URLSearchParams(searchParams);
    if(numPages && currentPage < numPages) {
      params.set("page", `${currentPage + 1}`);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  const prevPage = () => {
    const params = new URLSearchParams(searchParams);
    if(numPages && currentPage > 1) {
      params.set("page", `${currentPage - 1}`);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  const lastPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${numPages}`);
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if(numPages && ((currentPage > numPages) || (currentPage < 1))) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${1}`);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [numPages, searchParams, router, currentPage, pathname]);

  return (
    <div className="flex overflow-x-auto py-2">
      <Document className="flex flex-col gap-6 mx-auto" file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page className="prevent-select border " pageNumber={currentPage} />
        <div className="flex items-center gap-6 mx-auto">
          <div className="flex gap-2">
            <Button onClick={firstPage}><IconChevronsLeft /></Button>
            <Button disabled={numPages && currentPage <= 1 ? true : false} onClick={prevPage}><IconChevronLeft /></Button>
          </div>
          <Text>{currentPage} / {numPages}</Text>
          <div className="flex gap-2">
            <Button disabled={numPages && currentPage >= numPages ? true : false} onClick={nextPage}><IconChevronRight /></Button>
            <Button onClick={lastPage}><IconChevronsRight /></Button>
          </div>
        </div>
      </Document>
    </div>
  )
}
