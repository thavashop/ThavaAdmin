FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    // FilePondPluginFileEncode,
)

FilePond.setOptions({
    // stylePanelAspectRatio: 337/250,
    imageResizeTargetWidth: 250,
    imageResizeTargetHeight: 337,
    server: '/products/upload'
})

FilePond.parse(document.body)