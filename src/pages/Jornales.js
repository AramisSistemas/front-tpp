import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { SplitButton } from 'primereact/splitbutton';
import { classNames } from 'primereact/utils';
import { default as React, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../redux/messagesducks';
import { OperationService } from '../service/OperationService';

const Jornales = () => {
  const dispatch = useDispatch();
  const operationService = new OperationService();

  const activo = useSelector(store => store.users.activo);
  const operacion = useSelector(store => store.operations.datosManiobra)

  const dt = useRef(null);

  const [empresa, setEmpresa] = useState([]);
  const [maniobra, setManiobra] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [detalleLiquidaciones, setDetalleLiquidaciones] = useState([]);
  const [selectedJornales, setSelectedJornales] = useState([]);
  const [jornalActivo, setJornalActivo] = useState(null);
  const [jornalesFilter, setJornalesFilter] = useState(null);
  const [maniobrasFilter, setManiobrasFilter] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [jornalesRows, setJornalesRows] = useState(null);
  const [loading, setLoading] = useState(true);

  const jornalesItems = [
    {
      label: 'Pdf',
      icon: 'pi pi-file-pdf',
      command: () => { exportarJornalPdf() }
    },
    {
      label: 'Excel',
      icon: 'pi pi-file-excel',
      command: () => { console.log(jornalActivo) }
    },
    {
      label: 'Txt',
      icon: 'pi pi-file',
      command: () => { console.log(selectedJornales) }
    },
  ];

  const fetchLiquidaciones = async (operacion) => {
    await operationService.GetLiquidacionesByOp(operacion)
      .then(data => {
        setEmpresa(data.empresaDtos);
        setManiobra(data.operacionManiobra);
        setLiquidaciones(data.liquidacionModel);
        setDetalleLiquidaciones(data.liquidacionDetalleModel);
        setLoading(false);
      })
      .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));

  }

  const exportarJornalesPdf = () => {
    var limHor = 210;
    var limVer = 148.5;
    let item = 1;
    var doc = new jsPDF();
    selectedJornales.forEach(sj => {
      let man = maniobra.filter(m => m.idManiobra === sj.maniobra)
      let det = detalleLiquidaciones.filter(d => d.liquidacion === sj.liquidacion)

      if (item > 2) {
        item = 1;
        doc.addPage();
      }
      doc.setFontSize(20);
      doc.setFont("Times", "BoldItalic");
      doc.text(empresa[0].razon, 7, 8 + (limVer * (item - 1)));

      doc.setFontSize(10);
      doc.setFont("Times", "Roman");
      doc.text('Cuit:' + empresa[0].cuit, 40, 7 + (limVer * (item - 1)));
      doc.text('Domicilio: ' + empresa[0].domicilio, 40, 10 + (limVer * (item - 1)));

      doc.line(0, 12 + (limVer * (item - 1)), 210, 12 + (limVer * (item - 1))) // horizontal line logo  
      doc.line(0, 148.5, 210, 148.5) // horizontal MEDIA  
      doc.line(105, 0, 105, 297) // vertical MEDIA 

      doc.setFont("Times", "Bold");
      doc.setFontSize(10);
      doc.text("Fecha: " + moment(man[0].fecha).format('D/MM/yyyy') + " Turno: " + man[0].horario + " " + operacion.destino, 5, 16 + (limVer * (item - 1)));
      doc.text("Puesto: " + sj.puesto + "     Llave: " + sj.llave + "     Liq: " + sj.liquidacion, 5, 20 + (limVer * (item - 1)));
      doc.text("Empleado: " + sj.nombre + " (" + sj.cuit + ")", 5, 25 + (limVer * (item - 1)));

      doc.setDrawColor(0);
      doc.setFillColor(238, 238, 238);
      doc.roundedRect(5, 26 + (limVer * (item - 1)), limHor / 2 - 8, 7, 2, 2, "FD");
      doc.text("Concepto", 6, 30 + (limVer * (item - 1)));
      doc.text("% Un", 50, 30 + (limVer * (item - 1)));
      doc.text("Haberes", 63, 30 + (limVer * (item - 1)));
      doc.text("Descuentos", 83, 30 + (limVer * (item - 1)));
      doc.setFont("Times", "Roman");

      let pos = 37;
      det.forEach(x => {
        doc.text(x.concepto, 5, pos + (limVer * (item - 1)));
        doc.text(x.cantidad.toString(), 53, pos + (limVer * (item - 1)), "center");
        x.haber ? doc.text("$ " + x.monto.toString(), 62, pos + (limVer * (item - 1)), "left") : doc.text("$ " + x.monto.toString(), 83, pos + (limVer * (item - 1)), "left");
        pos += 4;
      });
      doc.setFillColor(238, 238, 238);
      doc.roundedRect(5, pos + (limVer * (item - 1)), limHor / 2 - 8, 26, 2, 2, "FD");
      doc.setFont("Times", "Bold");
      doc.text("TOTALES", 30, pos + 4 + (limVer * (item - 1)));
      doc.text("$ " + sj.haberes, 60, pos + 4 + (limVer * (item - 1)));
      doc.text("$ " + sj.descuentos, 80, pos + 4 + (limVer * (item - 1)));
      doc.text("NETO LIQUIDACION $ " + sj.neto, 6, pos + 10 + (limVer * (item - 1)));
      doc.text(sj.enLetras.substring(0, 100), 6, pos + 14 + (limVer * (item - 1)));
      doc.text(sj.enLetras.substring(101, sj.enLetras.lenght), 6, pos + 18 + (limVer * (item - 1)));
      doc.text("Depositados en CBU " + sj.cbu, 6, pos + 23 + (limVer * (item - 1)));
      doc.text("ORIGINAL             Firma del Empleador", 6, pos + 40 + (limVer * (item - 1)));
      //---------------------------------------------------------------------------------------------//
      doc.setFontSize(20);
      doc.setFont("Times", "BoldItalic");
      doc.text(empresa[0].razon, limHor / 2 + 7, 8 + (limVer * (item - 1)));

      doc.setFontSize(10);
      doc.setFont("Times", "Roman");
      doc.text('Cuit:' + empresa[0].cuit, limHor / 2 + 40, 7 + (limVer * (item - 1)));
      doc.text('Domicilio: ' + empresa[0].domicilio, limHor / 2 + 40, 10 + (limVer * (item - 1)));

      doc.setFont("Times", "Bold");
      doc.setFontSize(10);
      doc.text("Fecha: " + moment(man[0].fecha).format('D/MM/yyyy') + " Turno: " + man[0].horario + " " + operacion.destino, limHor / 2 + 5, 16 + (limVer * (item - 1)));
      doc.text("Puesto: " + sj.puesto + "     Llave: " + sj.llave + "     Liq: " + sj.liquidacion, limHor / 2 + 5, 20 + (limVer * (item - 1)));
      doc.text("Empleado: " + sj.nombre + " (" + sj.cuit + ")", limHor / 2 + 5, 25 + (limVer * (item - 1)));

      doc.setDrawColor(0);
      doc.setFillColor(238, 238, 238);
      doc.roundedRect(limHor / 2 + 5, 26 + (limVer * (item - 1)), 98, 7, 2, 2, "FD");
      doc.text("Concepto", limHor / 2 + 6, 30 + (limVer * (item - 1)));
      doc.text("% Un", limHor / 2 + 50, 30 + (limVer * (item - 1)));
      doc.text("Haberes", limHor / 2 + 63, 30 + (limVer * (item - 1)));
      doc.text("Descuentos", limHor / 2 + 83, 30 + (limVer * (item - 1)));
      doc.setFont("Times", "Roman");

      pos = 37;
      det.forEach(x => {
        doc.text(x.concepto, limHor / 2 + 5, pos + (limVer * (item - 1)));
        doc.text(x.cantidad.toString(), limHor / 2 + 52, pos + (limVer * (item - 1)), "center");
        x.haber ? doc.text("$ " + x.monto.toString(), limHor / 2 + 62, pos + (limVer * (item - 1)), "left") : doc.text("$ " + x.monto.toString(), limHor / 2 + 83, pos + (limVer * (item - 1)), "left");
        pos += 4;
      });
      doc.setFillColor(238, 238, 238);
      doc.roundedRect(limHor / 2 + 5, pos + (limVer * (item - 1)), 98, 26, 2, 2, "FD");
      doc.setFont("Times", "Bold");
      doc.text("TOTALES", limHor / 2 + 30 + (limVer * (item - 1)), pos + 4);
      doc.text("$ " + sj.haberes, limHor / 2 + 62, pos + 4 + (limVer * (item - 1)));
      doc.text("$ " + sj.descuentos, limHor / 2 + 82, pos + 4 + (limVer * (item - 1)));
      doc.text("NETO LIQUIDACION $ " + sj.neto, limHor / 2 + 6, pos + 10 + (limVer * (item - 1)));
      doc.text(sj.enLetras.substring(0, 100), limHor / 2 + 6, pos + 14 + (limVer * (item - 1)));
      doc.text(sj.enLetras.substring(101, sj.enLetras.lenght), limHor / 2 + 6, pos + 18 + (limVer * (item - 1)));
      doc.text("Depositados en CBU " + sj.cbu, limHor / 2 + 6, pos + 23 + (limVer * (item - 1)));
      doc.text("DUPLICADO             Firma del Empleado", limHor / 2 + 6, pos + 40 + (limVer * (item - 1)));
      item += 1;
    });
    doc.save("jornales.pdf");
    setSelectedJornales([]);
  }

  const exportarJornalPdf = () => {
    var limHor = 210;
    var limVer = 148.5;
    let item = 1;
    var doc = new jsPDF();
    let sj = jornalActivo;
    let man = maniobra.filter(m => m.idManiobra === sj.maniobra)
    let det = detalleLiquidaciones.filter(d => d.liquidacion === sj.liquidacion)

    if (item > 2) {
      item = 1;
      doc.addPage();
    }
    doc.setFontSize(20);
    doc.setFont("Times", "BoldItalic");
    doc.text(empresa[0].razon, 7, 8 + (limVer * (item - 1)));

    doc.setFontSize(10);
    doc.setFont("Times", "Roman");
    doc.text('Cuit:' + empresa[0].cuit, 40, 7 + (limVer * (item - 1)));
    doc.text('Domicilio: ' + empresa[0].domicilio, 40, 10 + (limVer * (item - 1)));

    doc.line(0, 12 + (limVer * (item - 1)), 210, 12 + (limVer * (item - 1))) // horizontal line logo  
    doc.line(0, 148.5, 210, 148.5) // horizontal MEDIA  
    doc.line(105, 0, 105, 297) // vertical MEDIA 

    doc.setFont("Times", "Bold");
    doc.setFontSize(10);
    doc.text("Fecha: " + moment(man[0].fecha).format('D/MM/yyyy') + " Turno: " + man[0].horario + " " + operacion.destino, 5, 16 + (limVer * (item - 1)));
    doc.text("Puesto: " + sj.puesto + "     Llave: " + sj.llave + "     Liq: " + sj.liquidacion, 5, 20 + (limVer * (item - 1)));
    doc.text("Empleado: " + sj.nombre + " (" + sj.cuit + ")", 5, 25 + (limVer * (item - 1)));

    doc.setDrawColor(0);
    doc.setFillColor(238, 238, 238);
    doc.roundedRect(5, 26 + (limVer * (item - 1)), limHor / 2 - 8, 7, 2, 2, "FD");
    doc.text("Concepto", 6, 30 + (limVer * (item - 1)));
    doc.text("% Un", 50, 30 + (limVer * (item - 1)));
    doc.text("Haberes", 63, 30 + (limVer * (item - 1)));
    doc.text("Descuentos", 83, 30 + (limVer * (item - 1)));
    doc.setFont("Times", "Roman");

    let pos = 37;
    det.forEach(x => {
      doc.text(x.concepto, 5, pos + (limVer * (item - 1)));
      doc.text(x.cantidad.toString(), 53, pos + (limVer * (item - 1)), "center");
      x.haber ? doc.text("$ " + x.monto.toString(), 62, pos + (limVer * (item - 1)), "left") : doc.text("$ " + x.monto.toString(), 83, pos + (limVer * (item - 1)), "left");
      pos += 4;
    });
    doc.setFillColor(238, 238, 238);
    doc.roundedRect(5, pos + (limVer * (item - 1)), limHor / 2 - 8, 26, 2, 2, "FD");
    doc.setFont("Times", "Bold");
    doc.text("TOTALES", 30, pos + 4 + (limVer * (item - 1)));
    doc.text("$ " + sj.haberes, 60, pos + 4 + (limVer * (item - 1)));
    doc.text("$ " + sj.descuentos, 80, pos + 4 + (limVer * (item - 1)));
    doc.text("NETO LIQUIDACION $ " + sj.neto, 6, pos + 10 + (limVer * (item - 1)));
    doc.text(sj.enLetras.substring(0, 100), 6, pos + 14 + (limVer * (item - 1)));
    doc.text(sj.enLetras.substring(101, sj.enLetras.lenght), 6, pos + 18 + (limVer * (item - 1)));
    doc.text("Depositados en CBU " + sj.cbu, 6, pos + 23 + (limVer * (item - 1)));
    doc.text("ORIGINAL             Firma del Empleador", 6, pos + 40 + (limVer * (item - 1)));
    //---------------------------------------------------------------------------------------------//
    doc.setFontSize(20);
    doc.setFont("Times", "BoldItalic");
    doc.text(empresa[0].razon, limHor / 2 + 7, 8 + (limVer * (item - 1)));

    doc.setFontSize(10);
    doc.setFont("Times", "Roman");
    doc.text('Cuit:' + empresa[0].cuit, limHor / 2 + 40, 7 + (limVer * (item - 1)));
    doc.text('Domicilio: ' + empresa[0].domicilio, limHor / 2 + 40, 10 + (limVer * (item - 1)));

    doc.setFont("Times", "Bold");
    doc.setFontSize(10);
    doc.text("Fecha: " + moment(man[0].fecha).format('D/MM/yyyy') + " Turno: " + man[0].horario + " " + operacion.destino, limHor / 2 + 5, 16 + (limVer * (item - 1)));
    doc.text("Puesto: " + sj.puesto + "     Llave: " + sj.llave + "     Liq: " + sj.liquidacion, limHor / 2 + 5, 20 + (limVer * (item - 1)));
    doc.text("Empleado: " + sj.nombre + " (" + sj.cuit + ")", limHor / 2 + 5, 25 + (limVer * (item - 1)));

    doc.setDrawColor(0);
    doc.setFillColor(238, 238, 238);
    doc.roundedRect(limHor / 2 + 5, 26 + (limVer * (item - 1)), 98, 7, 2, 2, "FD");
    doc.text("Concepto", limHor / 2 + 6, 30 + (limVer * (item - 1)));
    doc.text("% Un", limHor / 2 + 50, 30 + (limVer * (item - 1)));
    doc.text("Haberes", limHor / 2 + 63, 30 + (limVer * (item - 1)));
    doc.text("Descuentos", limHor / 2 + 83, 30 + (limVer * (item - 1)));
    doc.setFont("Times", "Roman");

    pos = 37;
    det.forEach(x => {
      doc.text(x.concepto, limHor / 2 + 5, pos + (limVer * (item - 1)));
      doc.text(x.cantidad.toString(), limHor / 2 + 52, pos + (limVer * (item - 1)), "center");
      x.haber ? doc.text("$ " + x.monto.toString(), limHor / 2 + 62, pos + (limVer * (item - 1)), "left") : doc.text("$ " + x.monto.toString(), limHor / 2 + 83, pos + (limVer * (item - 1)), "left");
      pos += 4;
    });
    doc.setFillColor(238, 238, 238);
    doc.roundedRect(limHor / 2 + 5, pos + (limVer * (item - 1)), 98, 26, 2, 2, "FD");
    doc.setFont("Times", "Bold");
    doc.text("TOTALES", limHor / 2 + 30 + (limVer * (item - 1)), pos + 4);
    doc.text("$ " + sj.haberes, limHor / 2 + 62, pos + 4 + (limVer * (item - 1)));
    doc.text("$ " + sj.descuentos, limHor / 2 + 82, pos + 4 + (limVer * (item - 1)));
    doc.text("NETO LIQUIDACION $ " + sj.neto, limHor / 2 + 6, pos + 10 + (limVer * (item - 1)));
    doc.text(sj.enLetras.substring(0, 100), limHor / 2 + 6, pos + 14 + (limVer * (item - 1)));
    doc.text(sj.enLetras.substring(101, sj.enLetras.lenght), limHor / 2 + 6, pos + 18 + (limVer * (item - 1)));
    doc.text("Depositados en CBU " + sj.cbu, limHor / 2 + 6, pos + 23 + (limVer * (item - 1)));
    doc.text("DUPLICADO             Firma del Empleado", limHor / 2 + 6, pos + 40 + (limVer * (item - 1)));
    item += 1;

    doc.save(sj.nombre + ".pdf");
    setJornalActivo(null);
  }

  const expandAll = () => {
    let _expandedRows = {};
    maniobra.forEach(p => _expandedRows[`${p.idManiobra}`] = true);
    setExpandedRows(_expandedRows);
  }

  const collapseAll = () => {
    setExpandedRows(null);
  }

  const headerManiobras = () => {
    return (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <div className="table-header-container">
          <Button icon="pi pi-plus" label="Ver Jornales" onClick={expandAll} className="mr-2 mb-2" />
          <Button icon="pi pi-minus" label="Ocultar Jornales" onClick={collapseAll} className="mb-2" />
        </div>
        <div className="flex align-items-center export-buttons">
          <Button type="button" icon="pi pi-file" onClick={() => console.log(selectedJornales)} className="mr-2" data-pr-tooltip="CSV" />
          <Button type="button" icon="pi pi-file-excel" onClick={() => console.log(selectedJornales)} className="p-button-success mr-2" data-pr-tooltip="XLS" />
          <Button type="button" icon="pi pi-file-pdf" onClick={() => exportarJornalesPdf()} className="p-button-warning mr-2" data-pr-tooltip="PDF" />
        </div>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setManiobrasFilter(e.target.value)} placeholder="Buscar..." />
        </span>
      </div>
    );
  }

  const lluviaBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.lluvia, 'text-pink-500 pi-times-circle': !rowData.lluvia })}></i>;
  }

  const insalubreBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.insalubre, 'text-pink-500 pi-times-circle': !rowData.insalubre })}></i>;
  }

  const sobrepesoBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.sobrepeso, 'text-pink-500 pi-times-circle': !rowData.sobrepeso })}></i>;
  }

  const jornalesTemplate = (data) => {
    return (
      <DataTable value={liquidaciones.filter(l => l.maniobra === data.idManiobra)} dataKey="liquidacion" responsiveLayout="scroll"
        header={headerJornalesTemplate} rowExpansionTemplate={detallesTemplate}
        expandedRows={jornalesRows} onRowToggle={(e) => setJornalesRows(e.data)}
        ref={dt} globalFilter={jornalesFilter}
        selection={selectedJornales} onSelectionChange={(e) => setSelectedJornales(e.value)}
      >
        <Column expander style={{ width: '3em' }} />
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="liquidacion" header="Nro" sortable />
        <Column field="cuit" header="Cuil" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="puesto" header="Puesto" sortable />
        <Column field="neto" header="Neto" sortable />
        <Column field="llave" header="Llave" sortable body={llaveBodyTemplate} />
        <Column headerStyle={{ width: '4rem' }} body={actionJornalesBodyTemplate} ></Column>
      </DataTable>
    )
  }

  const headerJornalesTemplate = () => {
    return (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <span className="image-text font-bold">Listado de Jornales</span>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setJornalesFilter(e.target.value)} placeholder="Buscar..." />
        </span>
      </div>
    );
  }

  const actionJornalesBodyTemplate = (rowData) => {
    return <SplitButton icon="pi pi-print" model={jornalesItems} menuStyle={{ width: '12rem' }} onShow={() => setJornalActivo(rowData)} className="p-button-success mr-2 mb-2" ></SplitButton>;
  }

  const fechaManiobraTemplate = (rowData) => {
    return <Moment format='D/MM/yyyy'>{rowData.fecha}</Moment>
  }

  const produccionBodyTemplate = (rowData) => {
    return <span className="p-tag">{rowData.produccion}</span>;
  }

  const llaveBodyTemplate = (rowData) => {
    return <Badge size="medium" value={rowData.llave} severity={rowData.llave > 1 ? 'danger' :
      rowData.llave === 1 ? 'success' : 'warning'}
      style={{ textAlign: 'center' }}></Badge>
  }

  const detallesTemplate = (data) => {
    return (
      <DataTable value={detalleLiquidaciones.filter(l => l.liquidacion === data.liquidacion)} dataKey="id" responsiveLayout="scroll"
        header={headerDetallesTemplate}
        expandedRows={jornalesRows} onRowToggle={(e) => setJornalesRows(e.data)}
      >
        <Column field="codigo" header="Codigo" sortable />
        <Column field="concepto" header="Concepto" sortable />
        <Column field="cantidad" header="Un. %" sortable />
        <Column field="monto" header="Haberes" sortable body={haberesDetalleTemplate} />
        <Column field="monto" header="Descuentos" sortable body={descuentosDetalleTemplate} />
        <Column headerStyle={{ width: '4rem' }} ></Column>
      </DataTable>
    )
  }

  const headerDetallesTemplate = (
    <span className="image-text font-bold">Detalles del Jornal</span>
  )

  const haberesDetalleTemplate = (rowData) => {

    return (
      rowData.haber ? <Badge className="mr-2" value={rowData.monto} severity={'success'} ></Badge> : ''
    )
  }

  const descuentosDetalleTemplate = (rowData) => {
    return (
      !rowData.haber ? <Badge className="mr-2" value={rowData.monto} severity={'warning'} ></Badge> : ''
    )
  }

  useEffect(() => {
    fetchLiquidaciones(operacion.id);
  }, [setLiquidaciones]);

  return (
    activo ? (
      <div className="col-12">
        <div className="card">
          <h5>Jornales de la Operación en {operacion.destino}</h5>
          <DataTable value={maniobra} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
            rowExpansionTemplate={jornalesTemplate} dataKey="idManiobra" header={headerManiobras} loading={loading}
            globalFilter={maniobrasFilter}
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="fecha" header="Fecha" body={fechaManiobraTemplate} />
            <Column field="horario" header="Horario" />
            <Column field="maniobra" header="Maniobra" sortable />
            <Column field="produccion" header="Produccion" sortable body={produccionBodyTemplate} />
            <Column field="lluvia" header="Lluvia" body={lluviaBodyTemplate} />
            <Column field="sobrepeso" header="Sobrepeso" body={sobrepesoBodyTemplate} />
            <Column field="insalubre" header="Insalubre" body={insalubreBodyTemplate} />
            <Column headerStyle={{ width: '4rem' }} ></Column>
          </DataTable>
        </div>
      </div>
    )
      : (<div className="card">
        <h4>Requiere Autenticación</h4>
        <div className="border-round border-1 surface-border p-4">
          <div className="flex mb-3">
            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
            <div>
              <Skeleton width="10rem" className="mb-2"></Skeleton>
              <Skeleton width="5rem" className="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div className="flex justify-content-between mt-3">
            <Skeleton width="4rem" height="2rem"></Skeleton>
            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
        </div>
      </div>)
  )
}
const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Jornales, comparisonFn);   