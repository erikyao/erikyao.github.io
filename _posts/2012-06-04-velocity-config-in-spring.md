---
category: Spring
description: ''
tags: []
title: 'Spring: Velocity config'
---

Example from project: 

```xml
<bean id="velocityConfig"  class="org.springframework.web.servlet.view.velocity.VelocityConfigurer">
	<property name="velocityProperties">
		<props>
			<prop key="resource.loader">file</prop>
			<prop key="file.resource.loader.class">org.apache.velocity.runtime.resource.loader.FileResourceLoader</prop>
			<prop key="file.resource.loader.path">${webapp.letterpaper.root}/WEB-INF/vm</prop>
			<prop key="file.resource.loader.cache">true</prop>
			<prop key="file.resource.loader.modificationCheckInterval">300</prop>
		</props>
	</property>
</bean>
```

`resource.manager.logwhenfound = true`

> Switch to control logging of 'found' messages from resource manager. When a resource is found for the first time, the resource name and classname of the loader that found it will be noted in the runtime log.

`resource.manager.cache.class`

> Declares the class to be used for resource caching. The current default is `org.apache.velocity.runtime.resource.ResourceCacheImpl ` which uses a LRU Map to prevent data from being held forever. You can set the size of the LRU Map using the parameter resource.manager.defaultcache.size. The dafault value of the default cache size is currently 89.

`resource.manager.defaultcache.size`

> Sets the size of the default implementation of the resource manager resource cache.

`resource.loader = <name> (default = file)`

> Multi-valued key. Will accept CSV for value. Public name of a resource loader to be used. This public name will then be used in the specification of the specific properties for that resource loader. Note that as a multi-valued key, it's possible to pass a value like "file, class" (sans quotes), indicating that following will be configuration values for two loaders.

`<name>.loader.description = Velocity File Resource Loader`

> Description string for the given loader.

`<name>.resource.loader.class = org.apache.velocity.runtime.resource.loader.FileResourceLoader`

> Name of implementation class for the loader. The default loader is the file loader.

`<name>.resource.loader.path = .`

> Multi-valued key. Will accept CSV for value. Root(s) from which the loader loads templates. Templates may live in subdirectories of this root. ex. homesite/index.vm This configuration key applies currently to the FileResourceLoader and JarResourceLoader.

`<name>.resource.loader.cache = false`

> Controls caching of the templates in the loader. Default is false, to make life easy for development and debugging. This should be set to true for production deployment. When 'true', the modificationCheckInterval property applies. This allows for the efficiency of caching, with the convenience of controlled reloads - useful in a hosted or ISP environment where templates can be modifed frequently and bouncing the application or servlet engine is not desired or permitted.

`<name>.resource.loader.modificationCheckInterval = 2`

> This is the number of seconds between modification checks when caching is turned on. When this is an integer 0, this represents the number of seconds between checks to see if the template was modified. If the template has been modified since last check, then it is reloaded and reparsed. Otherwise nothing is done. When <= 0, no modification checks will take place, and assuming that the property cache (above) is true, once a template is loaded and parsed the first time it is used, it will not be checked or reloaded after that until the application or servlet engine is restarted.

To illustrate, here is an example taken right from the default Velocity properties, showing how setting up the `FileResourceLoader` is managed

- `resource.loader = file`
- `file.resource.loader.description = "Velocity File Resource Loader"`
- `file.resource.loader.class = org.apache.velocity.runtime.resource.loader.FileResourceLoader`
- `file.resource.loader.path = .`
- `file.resource.loader.cache = false`
- `file.resource.loader.modificationCheckInterval = 2`