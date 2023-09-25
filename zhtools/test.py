from langconv import *
name = 'zh-hans'
c = Converter(name)
text = '中国'
new = c.convert(text)
print(new)
#relative_path ="5-browser-extension/1-about-browsers/translations/"
#relative_path ="5-browser-extension/2-forms-browsers-local-storage/translations/"
#relative_path ="5-browser-extension/3-background-tasks-and-performance/translations/"
#relative_path ="6-space-game/1-introduction/translations/"
#relative_path ="6-space-game/3-moving-elements-around/translations/"
#relative_path ="6-space-game/4-collision-detection/translations/"
#relative_path ="6-space-game/5-keeping-score/translations/"
#relative_path ="6-space-game/6-end-condition/translations/"
#relative_path ="7-bank-project/2-forms/translations/"
#relative_path ="7-bank-project/3-data/translations/"
#relative_path ="7-bank-project/4-state-management/translations/"
#relative_path ="7-bank-project/api/translations/"
#relative_path ="4-typing-game/typing-game/translations/"
relative_path ="3-terrarium/2-intro-to-css/translations/"
pathin = relative_path+"README.zh-tw.md"
pathout = relative_path+"README.zh-cn.md"
with open(pathin, 'r', encoding='utf-8') as fr, open(pathout, 'w', encoding='utf-8') as fw:
    for line in fr:
        fw.write(c.convert(line))

pathin = relative_path+"assignment.zh-tw.md"
pathout = relative_path+"assignment.zh-cn.md"
with open(pathin, 'r', encoding='utf-8') as fr, open(pathout, 'w', encoding='utf-8') as fw:
    for line in fr:
        fw.write(c.convert(line))