import React, { useEffect, useState } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { RxChevronDown, RxChevronUp } from "react-icons/rx";
import { TbMoodCry } from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import { VscError } from "react-icons/vsc";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { RiFullscreenFill, RiFullscreenExitLine  } from "react-icons/ri";
// import './styles.css'
// import './style.css'

type TableColumn = {
  key: string;
  label: string;
  renderCell?: (cellData: any, rowData?: any) => React.ReactNode;
  width?: number | string;
};

type customStylingProp = {
  component?: React.CSSProperties; // Styles for the component wrapper
  table?: React.CSSProperties; // Styles for the table
  tableWrapper?: React.CSSProperties;
  header?: React.CSSProperties; // Styles for the table header
  body?: React.CSSProperties; // Styles for the table body
  footer?: React.CSSProperties;
  stripeStyle?: React.CSSProperties;
  tableCell?: React.CSSProperties;
};

type TableData = { [key: string]: any }[];

type TableProps = {
  data: TableData | null | any;
  columns: TableColumn[];
  toolbars?: React.ReactNode[];
  userComponents?: React.ReactNode;
  enableServerPagination?: boolean;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onGlobalTableSearchChange?: (searchTerm: string) => void;
  globalSearchText?: string;
  loading?: boolean;
  isError?: boolean;
  renderRowDetails?: (props: { row: any }) => React.ReactNode;
  showActions?: (rowData: any) => React.ReactNode;
  enableStripStyle?: boolean;
  removeStraightLines?: boolean;
  printTools?: boolean;
  tableTitle?: string;
  onRowSelection?: (rowData: any) => void;
  customStyles?: customStylingProp;
  showSearch?: boolean;
  totalRowsCount?: number;
};

const itemsPerPageOptions = [5, 8, 10, 15, 20]

const DBLTable: React.FC<TableProps> = ({
  data,
  columns,
  toolbars,
  userComponents,
  enableServerPagination = false,
  onPaginationChange,
  onGlobalTableSearchChange,
  globalSearchText,
  loading = false,
  isError = false,
  renderRowDetails,
  showActions,
  enableStripStyle = true,
  removeStraightLines,
  printTools,
  tableTitle,
  onRowSelection,
  showSearch = true,
  customStyles = {},
  totalRowsCount,
}) => {
  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  // const [globalSearchText, setGlobalSearchText] = useState('');

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('asc');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState<'none' | 'all'>('none');
  const [showFullScreen, setShowFullScreen] = useState(false)

  const handleRowSelection = (rowData: any) => {
    setSelectedRows((prevSelectedRows) => {
      const isRowSelected = prevSelectedRows.some(row => row === rowData);
      const updatedSelectedRows = isRowSelected
        ? prevSelectedRows.filter(row => row !== rowData)
        : [...prevSelectedRows, rowData];

      if (onRowSelection) {
        onRowSelection(updatedSelectedRows);
      }

      return updatedSelectedRows;
    });
  };

  

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectAll(value as 'none' | 'all');

    if (value === 'all') {
      setSelectedRows(data || []);
      if (onRowSelection) {
        onRowSelection(data || []);
      }
    } else {
      setSelectedRows([]);
      if (onRowSelection) {
        onRowSelection([]);
      }
    }
  };

  

  useEffect(() => {
    if (enableServerPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: currentPage, pageSize: itemsPerPage });
    }
  }, [currentPage, itemsPerPage]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // if (!Array.isArray(data)) {
  //   throw new Error("Data must be an array");
  // }
  

  const searchedData = Array.isArray(data) ? data.filter((item: any) => {
    if (typeof item === 'object') {
      return Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false;
  }) : [];

  const sortedData = searchedData ? [...searchedData].sort((a, b) => {
    const keyA = sortColumn ? a[sortColumn] : null;
    const keyB = sortColumn ? b[sortColumn] : null;

    if (keyA === keyB) {
      return 0;
    }

    if (sortOrder === 'asc') {
      return keyA < keyB ? -1 : 1;
    } else {
      return keyA > keyB ? -1 : 1;
    }
  }) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = Array.isArray(sortedData) ? sortedData.slice(startIndex, endIndex) : [];

  const totalPages = enableServerPagination ? Math.ceil((totalRowsCount || 1) / itemsPerPage) : Math.ceil((data?.length || 1) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (enableServerPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: newPage, pageSize: itemsPerPage });
    }
  };

  const handleSearchChange = (term: string) => {
    // console.log('Search Term:', term)
    onGlobalTableSearchChange ? onGlobalTableSearchChange(term) : setSearchTerm(term);
    // onGlobalTableSearchChange && onGlobalTableSearchChange(globalSearchText)
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    try {
      const csvContent = columns.map(column => column.label).join(',') + '\n';
      const csvRows = data.map((row: any) => columns.map(column => row[column.key]).join(',')).join('\n');
      const csvData = csvContent + csvRows;

      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exported_data.csv';
      link.click();
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    }
  };

  const showCheckboxColumn = !!onRowSelection;

  


  
  const TableRowComp = ({
      row,
      rowIndex ,
      selectedRows, 
      onRowSelection,
      showCheckboxColumn,
    }:
    { 
      row: any;
      rowIndex: number; 
      selectedRows: any[];
      onRowSelection?: (rowData: any) => void;
      showCheckboxColumn?: boolean;
    }) => {
    const [displayRenderDetails, setDisplayRenderDetails] = useState<boolean>(false);
    // const [rowSelectionState, setRowSelectionState] = useState<boolean | any>(false)

    const isSelected = selectedRows.includes(row);

    const handleCheckboxChange = () => {
      if (onRowSelection) {
        onRowSelection(row);
      }
    };

    return (
      <React.Fragment>
        <tr 
          style={{
            ...(enableStripStyle && rowIndex % 2 === 0 && customStyles.stripeStyle
              ? customStyles.stripeStyle
              : {}),
            ...(isSelected && { backgroundColor: '#DFF7FF' })
          }}
          className={`${enableStripStyle && rowIndex % 2 === 0 ? `bg-gray-100` : 'bg-white'}`}
          >
          {showCheckboxColumn && (
            <td className='px-4 py-3 text-left border-t border-r border-gray-100'>
              <input
                className='w-[14px] h-[14px]'
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
              />
            </td>
          )}
          {renderRowDetails && (
            <th onClick={() => setDisplayRenderDetails(!displayRenderDetails)} className="px-4 py-3 text-left border-t border-r border-gray-100">
              {displayRenderDetails ? <RxChevronUp /> : <RxChevronDown />}
            </th>
          )}
          {columns.map((column, colIndex) => (
            <td
              title={row[column.key]} 
              key={colIndex}
              className={`py-3 px-4 ${
                enableStripStyle && colIndex === columns.length - 1
                  ? 'border-b'
                  : removeStraightLines
                  ? ''
                  : 'border-r'
              } border-gray-100 ${!enableStripStyle && colIndex === columns.length - 1 ? 'border-b' : 'border-b'}`}
              style={{...customStyles.tableCell, overflow: 'hidden', textOverflow: 'ellipsis'}}
            >
              {column.renderCell
                ? column.renderCell(row[column.key], row)
                : row[column.key]
              }
          </td>
          ))}
          {showActions && (
            <td className={`px-4 py-3 border-b border-gray-100 ${!removeStraightLines ? 'border-l-gray-100' : ''}`}>
              {showActions(row)}
            </td>
          )}
        </tr>
        {renderRowDetails && displayRenderDetails && (
          <tr className={`h-auto ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-white'} transition-max-h duration-300 ease-out border-y border-gray-100`}>
            <td colSpan={columns.length + (showActions ? 1 : 0)}>
              {renderRowDetails && renderRowDetails({ row })}
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  }



  return (
    <div className={`rounded ${showFullScreen ? 'fixed inset-0 z-50 bottom-0' : ''} max-h-auto inter-light overflow-auto bg-white text-gray-500 shadow-lg p-6 w-full mx-auto mb-6 ${enableStripStyle ? 'striped' : ''}`} style={customStyles.component}>
      <div className="flex items-center justify-between mb-4 bg-white">
        <div className='flex flex-col items-center justify-between w-full md:flex-row'>
          <h3 className="text-lg font-semibold text-gray-800 whitespace-nowrap">{tableTitle ? tableTitle : ''}</h3>
          <div className="flex flex-col md:flex-row items-center justify-center w-full space-x-2 md:justify-end">
            {printTools && (
                <div className="flex items-center justify-center mb-2">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1 text-white bg-green-500 rounded"
                    onClick={handleExportToExcel}
                  >
                    <SiMicrosoftexcel />
                    Excel
                  </button>
                </div>
              )}
            {toolbars &&
              toolbars.map((toolbar, index) => (
                <div key={index} className="mb-2 mr-2">
                  {toolbar}
                </div>
              ))}
            {showSearch && <div className="relative h-10 mb-2 w-ful">
              <input
                type="text"
                value={ onGlobalTableSearchChange ? globalSearchText : searchTerm}
                onChange={(e: any) => handleSearchChange(e.target.value)}
                placeholder='Search anything'
                className='h-full pl-8 pr-4 transition-colors border rounded-md sm:min-w-24 w-ful focus:outline-none focus:border-blue-300'
              />
              <IoSearchOutline className='absolute transform -translate-y-1/2 top-1/2 left-2' />
            </div>}
          </div>
        </div>
      </div>
      <div>
          {userComponents}
      </div>
        <div style={customStyles.tableWrapper} className='max-h-[600pxx] overflow-auto my-custom-scrollbar2'>
          <table className="w-full text-[15px] border-collapse" style={{...customStyles.table}}>
            <thead style={customStyles.header} className={`${!enableStripStyle && 'bg-gray-100'}`}>
              <tr>
              {/* {onRowSelection &&  <th className="px-4 py-3 text-left border-t border-r border-gray-100">Select</th>} */}
              {onRowSelection &&  
                <th className="px-4 py-3 text-left border-t border-r border-gray-100">
                  <input
                    type="checkbox"
                    checked={selectAll === 'all'}
                    onChange={() => handleSelectAllChange({ target: { value: selectAll === 'all' ? 'none' : 'all' } } as any)}
                  />
                </th>
                }
              {renderRowDetails && <th className="px-4 py-3 text-left border-t border-r border-gray-100"><HiMiniChevronUpDown /></th>}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`${!enableStripStyle && 'bg-gray-100'} py-3 px-4 text-left border-r border-t border-gray-100`}
                    style={{ minWidth: column.width, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                {showActions && <th className="px-4 py-3 text-left border-t border-r border-gray-100">Actions</th>}
              </tr>
            </thead>
            <tbody style={customStyles.body} className='my-custom-scrollbar'>
            {isError ? ( 
              <tr className='border'>
                <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                  <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <VscError className="mr-2 text-[4rem] text-red-300" />
                    <span className="text-gray-500">Error in fetching data. Please try again.</span>
                  </div>
                </td>
              </tr>
            ) : (
              data?.length === 0 ? (
                <tr className='border'>
                  <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                    <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                      <TbMoodCry className="mr-2 text-4xl text-gray-500" />
                      No data available
                    </div>
                  </td>
                </tr>
              ) : (
                loading ? (
                  <tr>
                    <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                      <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                        <ImSpinner2 className={`animate-spin text-4xl`}/>
                        <p>Loading Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Render table rows
                  paginatedData?.map((row, rowIndex) => (
                    <TableRowComp key={rowIndex} row={row} rowIndex={rowIndex} selectedRows={selectedRows} onRowSelection={handleRowSelection} showCheckboxColumn={showCheckboxColumn}/>
                  ))
                )
              )
            )}
          </tbody>

          </table>
          </div>
          <div className="sticky bottom-0 flex justify-between items-center  w-full mt-4">
            <button onClick={()=>setShowFullScreen(prev => !prev)}>
              {showFullScreen ? <RiFullscreenExitLine size={20}/> : <RiFullscreenFill size={20}/> }
            </button>
          
            <div className='flex justify-end items-center gap-3'>
              <div className='flex justify-center items-center gap-1'>
                <span className="mr-2 hidden md:block">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
                  className="px-2 py-1 border border-gray-300 rounded"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center ">
                {totalPages > 1 && (
                  <div className="flex justify-end items-center">
                    <button
                      className={`px-3 py-1 text-gray-500 rounded ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {/* <p className='hidden md:block'>Previous</p> */}
                      <IoIosArrowDropleft size={30} className=''/>
                    </button>
                    <span className="mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`px-3 py-1 text-gray-500 rounded ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {/* <p className='hidden md:block'>Next</p> */}
                      <IoIosArrowDropright size={30} className=''/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        
    </div>
  );
};


export default DBLTable;
