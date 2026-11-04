from PIL import Image

icon = Image.open('public/images/logo-icon.png')
print('Icon size:', icon.size, icon.mode)

# Render over site's background #fcf9f3
site_bg = (252, 249, 243) # #fcf9f3
test_render = Image.new('RGB', icon.size, site_bg)
test_render.paste(icon, (0, 0), icon)
test_render.save('public/images/test-icon-on-sitebg.png')

# Render over pure white #ffffff
white_render = Image.new('RGB', icon.size, (255, 255, 255))
white_render.paste(icon, (0, 0), icon)
white_render.save('public/images/test-icon-on-white.png')

print('Test renders saved successfully.')

