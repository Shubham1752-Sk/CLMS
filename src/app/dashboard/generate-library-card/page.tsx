'use client'
import React, {useRef} from 'react'
import useAppContext from '@/contexts';
import LibraryCard from '@/components/dashboard/LibraryCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GenerateLibraryCard = () => {
    const {user} = useAppContext();
    const cardRef = useRef<HTMLDivElement>(null);
    console.log(user)

    const downloadCardAsPDF = async () => {
      const cardElement = cardRef.current;
      console.log("Downloading started")
      if(cardElement){
        html2canvas(cardElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          console.log("pdf is:",pdf)
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
    
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
    
          pdf.save('Library_Card.pdf'); // Download the PDF
        });
      }
    };
  return (
    <div className='w-full h-full text-center px-2 py-2 flex flex-col justify-center'>
      <p className='fixed top-2 mx-auto text-center font-bold text-2xl '>Generate Library Card</p>
      <LibraryCard  user={user} />
      <button
        onClick={downloadCardAsPDF}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Download Library Card as PDF
      </button>
    </div>
  )
}

export default GenerateLibraryCard
