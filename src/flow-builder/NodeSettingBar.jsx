import React, {useCallback, useState} from 'react';

export default ({ panelWrapper, selectedNode = null }) => {

    const [settingBarWidth, setSettingBarWidth] = useState(400);

    /* Set drag ghost image to empty image */
    const onDragStart = useCallback((event) => {
        event.dataTransfer.setDragImage(new Image(), 0, 0);
    }, [])

    const onDrag = useCallback((event) => {
        const panelBounds = panelWrapper.current.getBoundingClientRect();
        if (event.clientX !== 0) {
            let newBarWidth = panelBounds.width - event.clientX;
            setSettingBarWidth(Math.min(Math.max(newBarWidth, 30), panelBounds.width - 90))
        }
    }, []);

  return (
    <aside
        className="flex box-border bg-slate-50"
        style={{ width: settingBarWidth }}
    >

        {/* Draggable bar */}
        <div
            className="flex flex-col justify-center w-5 border-x border-slate-200 cursor-col-resize"
            draggable
            onDragStart={onDragStart}
            onDrag={onDrag}
        >
            <div className="w-1 h-5 mx-2 border-x border-slate-500"></div>
        </div>

      {selectedNode && <p>{selectedNode.data.label}</p>}

      {/*<div className="relative flex flex-wrap items-stretch">*/}
      {/*  <span*/}
      {/*    className="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"*/}
      {/*    id="parameter-task_id"*/}
      {/*    >task_id</span*/}
      {/*  >*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    className="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-transparent bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"*/}
      {/*    placeholder=""*/}
      {/*    aria-label="task_id"*/}
      {/*    aria-describedby="parameter-task_id" />*/}
      {/*</div>*/}

      {/*<div className="relative mb-4 flex flex-wrap items-stretch">*/}
      {/*  <span*/}
      {/*    className="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"*/}
      {/*    id="parameter-python_callable"*/}
      {/*    >python_callable</span*/}
      {/*  >*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    className="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-transparent bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"*/}
      {/*    placeholder=""*/}
      {/*    aria-label="python_callable"*/}
      {/*    aria-describedby="parameter-python_callable" />*/}
      {/*</div>*/}

    </aside>
  );
};