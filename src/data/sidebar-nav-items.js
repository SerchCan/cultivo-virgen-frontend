export default function() {
  return [
    {
      title: "Resumen General",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">insert_chart</i>',
      htmlAfter: ""
    },
    {
      title: "Alimentación",
      htmlBefore: '<i class="material-icons">content_paste</i>',
      to: "/feedings",
    },
    {
      title: "Almacén",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/tables",
    },
    {
      title: "Clientes",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    },
    {
      title: "Reportes",
      htmlBefore: '<i class="material-icons">picture_as_pdf</i>',
      to: "/errors",
    }
  ];
}
